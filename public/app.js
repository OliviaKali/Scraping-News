$.getJSON("/articles", function (data) {
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

$(document).on("click", "#idInfo", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);

      $("#notes").append(`<form id="myform">
        <div class="form-group">
          <h3>${data.title}</h3>
          <input input id="titleinput" name="title" class="form-control" placeholder="Note Title">
        </div>
      
        <div class="form-group">
          <textarea class="form-control" id="bodyinput" name="body" rows="3" placeholder="Leave Note Here"></textarea>
        </div>
      </form>
      <button data-id="${data._id}" id="savenote" class="btn btn-info">Save Note</button>
      <button type="button" class="delete-btn btn btn-info">Clear Note</button>`);

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");

  var newTitle = $("#titleinput").val();
  var newBody = $("#bodyinput").val();

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: newTitle,
      body: newBody
    }
  })
    .then(function (data) {

      console.log(data);
      //   $("#notes").empty();
      $("#articleNotes").append(`<br>
      <div class="alert alert-secondary" role="alert">
      Your note has been saved
    </div>`)
    
    })
});


$(document).on("click", ".delete-btn", function () {
  // $('#myform').reset();
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


// $(document).on("click", "delete-btn", function() {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     type: "DELETE",
//     url: "notes/delete/" + thisId,
//     // success: function(response) {
//     //   $("#titleinput").val("");
//     //   $("#bodyinput").val("");
//     // }
//   })
// })


