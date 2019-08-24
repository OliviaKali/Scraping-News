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

app.put("/articles/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
    .then(function(dbArticle) {   
          console.log(dbArticle);
          res.json(dbArticle);
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
  
  app.post("/notes/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbArticle) {
        return db.Note.findOneAndUpdate(
          { _id: req.params.id },
          { article: dbArticle._id },
          { new: true }
        );
      })
      .then(function(dbNote) {
        res.json(dbNote);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


  app.get("/notes/:id", function(req, res) {
    db.Note.find({ _articleId: req.params.id })
      .then(function(dbNote) {
        res.json(dbNote);
      //   return db.Note.find({})
      })
  });

// Routes with ORM
//var notesController = require("./controller/notes")

  app.delete("/notes/:id", function(req, res) {
    db.Note.remove({ _articleId: req.params.id })
    .then(function(dbNote) {
      res.json(data);
    });
  });
  
  app.post("/notes", function(req, res) {
    db.Note.create(req.body, function (dbNote) {
      res.json(dbNote)
    });
  });

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});