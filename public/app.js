// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // Make the form fixed so it appears everywhere on the page
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

// Whenever someone clicks a p tag
$(document).on("click", "#idInfo", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
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

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
    //   $("#notes").empty();

    // for (var i = 0; i < data.length; i++) {
    //     $("#notes").append(`<div class="card" style="width: 18rem;">
    //     <div class="card-body">
    //       <h5 class="${data[i].title}"></h5>
    //       <p class="card-text">${data[i].body}</p>
    //     </div>
    //   </div>`)
    // }
    }).catch(err => {
        console.log(err)
          $("#titleinput").val("");
          $("#bodyinput").val("");
    });

  // Also, remove the values entered in the input and textarea for note entry
});
