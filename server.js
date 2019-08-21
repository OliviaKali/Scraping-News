var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 8080;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.set("views", "./views")
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/ScrapingNews", { useNewUrlParser: true });

// Routes

app.get("/", function(req, res) {
    // res.send("Didn't want a blank page")
  db.Article.find({})
  .then(data => {

    var articleObj = {
        articles: data
      };
      res.render("index", articleObj)
  }).catch(err => res.send(err));
});

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.espn.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".contentItem__content").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find(".contentItem__title")
        .text();
      result.summary = $(this)
        .find(".contentItem__subhead")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      if (result.title && result.summary && result.link) {
        db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        //   if (title && summary && link) {

        //   }
        })
        .catch(function(err) {
          // If an error occurred, log it
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

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    //   return db.Note.find({})
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

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

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
