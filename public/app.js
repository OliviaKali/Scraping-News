$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articleList").append(`<div id="idInfo" data-id="${data[i]._id}">
    <br>
    <h4>${data[i].title}</h4>
    <ul>
        <li class="bold">Summary: ${data[i].summary}</li>
        <li class="bold">Link: ${data[i].link}</li>
     </ul>
     <br>
     </div>`);
  }
});

$(document).on("click", "#idInfo", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function(data) {
      console.log(data);

      $("#notes").append(`<form>
        <div class="form-group">
          <h3>${data.title}</h3>
          <input input id="titleinput" name="title" class="form-control" placeholder="Note Title">
        </div>
      
        <div class="form-group">
          <textarea class="form-control" id="bodyinput" name="body" rows="3" placeholder="Leave Note Here"></textarea>
        </div>
      </form>
      <button data-id="${data._id}" id="savenote">Save Note</button>`);

      // var noteData = {
      //   _id: currentArticle._id,
      //   notes: data || []
      // };

      // $("#savenote").data("article", noteData)

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// function renderNotesList(data) {
//   // This function handles rendering note list items to our notes modal
//   // Setting up an array of notes to render after finished
//   // Also setting up a currentNote variable to temporarily store each note
//   var notesToRender = [];
//   var currentNote;
//   if (!data.notes.length) {
//     // If we have no notes, just display a message explaining this
//     currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
//     notesToRender.push(currentNote);
//   } else {
//     // If we do have notes, go through each one
//     for (var i = 0; i < data.notes.length; i++) {
//       // Constructs an li element to contain our noteText and a delete button
//       currentNote = $("<li class='list-group-item note'>")
//         .text(data.notes[i].noteText)
//         .append($("<button class='btn btn-danger note-delete'>x</button>"));
//       // Store the note id on the delete button for easy access when trying to delete
//       currentNote.children("button").data("_id", data.notes[i]._id);
//       // Adding our currentNote to the notesToRender array
//       notesToRender.push(currentNote);
//     }
//   }
// }

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
    
    var newTitle =  $("#titleinput").val();
    var newBody = $("#bodyinput").val();

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: newTitle,
      body: newBody
    }
  })
    .then(function(data) {
        console.log("data");
        console.log(data);
    //   $("#notes").empty();

//Get function to make notes appear without disappearing 
//whenever you click on a new article

        $("#notes").append(`<br>
        <div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-text">${data.title}</h5>
          <p class="card-text">${data.body}</p>
        </div>
      </div>
      <button type="button" class="delete-btn btn btn-info">Delete</button>`)
    //need to do a get request to make the note appear again
    }).catch(err => {
        console.log(err)
          $("#titleinput").val("");
          $("#bodyinput").val("");
    });
    // renderNotesList();
});

// $(document).on("click", "#savenote", function(){
//   var thisId = $(this).attr("data-id");
//   $.get("/api/notes" + currentArticle._id).then(function(data) {

//   })
// })

// $(document).on("click", "delete-btn", function() {
//   var deletedNote = 
// })


