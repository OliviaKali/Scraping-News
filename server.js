var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", "./views")
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/ScrapingNews", { useNewUrlParser: true });

// Routes
app.get("/", function(req, res) {
  db.Article.find({})
  .then(data => {

    var articleObj = {
        articles: data
      };
      res.render("index", articleObj)
  }).catch(err => res.send(err));
});

app.get("/scrape", function(req, res) {
  axios.get("https://www.espn.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $(".contentItem__content").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .find(".contentItem__title")
        .text();
      result.summary = $(this)
        .find(".contentItem__subhead")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      if (result.title && result.summary && result.link) {
        db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      } 
    });

    // Send a message to the client
    // res.render("index", dbArticle);
    //check for duplicates in database
    // console.log("checking for database duplicates...");
    // db.Article.find({}, function(err, data) {
    //     data.forEach(function(i, element) {
    //         result.forEach(function(i2, element2) {
    //             //if link matches one in the database...
    //             if (i.link === i2.link) {
    //                 console.log("duplicate found!");
    //                 //delete the duplicate from the array
    //                 result.splice(element2, 1);
    //                 console.log("duplicate deleted.");
    //             }
    //         });
    //     });
    // });
    res.redirect('/')
  });

});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    //   return db.Note.find({})
    })
    .catch(function(err) {
      res.json(err);
    });
});


app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
          console.log(dbArticle);
        
        db.Note.findOne({ _id: dbArticle.note })
        .then(function(dbArticle) {
            
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function(err) {
          res.json(err);
        });
        // res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


// app.post("/articles/:id", function(req, res) {
//     // console.log(req.body);

//   db.Note.create(req.body)

//     .then(function(dbNote) {
//       return db.Article.find(
//         { _id: dbNote._id,
//             body: dbNote.body
//         }
//       )
//     })
//     .then(function(dbArticle) {
//     console.log(dbArticle);
//       res.send(dbArticle);
      
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

app.get("/notes/", function(req, res) {
    db.Note.find({})
    .populate("note")
    .then(function(dbNote) {
        res.json(dbNote);
    })
    .catch(function(err) {
        res.json(err)
    })
})

// app.get("/delete/:id", function(req, res) {
//   db.Note.deleteOne({
//     _id: dbArticle.note
//   }, function(error, removed) {
//     if (error) {
//       console.log(error);
//       res.send(error);
//     } else {
//       console.log(removed);
//       res.send(removed);
//     }
//   });
// });

// app.get("/notes/:id", function(req, res) {
//     db.Note.findOne({ _id: req.params.id })
//       .populate("article")
//       .then(function(dbNote) {
//         res.json(dbNote);
//       //   return db.Note.find({})
//       })
//       .catch(function(err) {
//         res.json(err);
//       });
//   });
  
//   app.post("/notes/:id", function(req, res) {
//     db.Note.create(req.body)
//       .then(function(dbArticle) {
//         return db.Note.findOneAndUpdate(
//           { _id: req.params.id },
//           { article: dbArticle._id },
//           { new: true }
//         );
//       })
//       .then(function(dbNote) {
//         res.json(dbNote);
//       })
//       .catch(function(err) {
//         res.json(err);
//       });
//   });

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});