var db = require("../models");

module.exports = {
    get: function(data, cb) {
      db.Note.find({
        _articleId: data._id
      }, cb);
    },
    save: function(data, cb) {
      var newNote = {
        _articleId: data._id,
        title: data.title,
        body: data.body
      };
      db.Note.create(newNote, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
          cb(doc)
        }
      })
    },
    delete: function(data, cb) {
      db.Note.remove({
        _id: data._id
      }, cb);
    }
  }


//   app.get("/notes/:article_id?", function(req, res) {
//     var query = {};
//     if (req.params.article_id) {
//       query._id = req.params.article_id;
//     }
  
//     notesController.get(query, function(err, data) {
//       res.json(data);
//     });
//   });
  
//   app.delete("/notes/:id", function(req, res) {
//     var query = {};
//     query._id = req.params.id;
//     notesController.delete(query, function(err, data) {
//       res.json(data);
//     });
//   });
  
//   app.post("/notes", function(req, res) {
//     notesController.save(req.body, function(data) {
//       res.json(data);
//     });
//   });