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

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

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
});

// $(document).on("click", "#savenote", function(){
//   var thisId = $(this).attr("data-id");
//   $.get("/api/notes" + currentArticle._id).then(function(data) {

//   })
// })

// $(document).on("click", "delete-btn", function() {
//   // var deletedNote = 
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     type: "GET",
//     url: "/delete" + thisId,
//     success: function(response) {

//       $("#titleinput").val("");
//       $("#bodyinput").val("");
//     }
//   })
// })


