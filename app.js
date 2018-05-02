function watchSubmit() {
  $("#addRecord").submit(function(event) {
    let data = $(this).serializeArray();
    let URL = "mongodb://waxstack:waxstack@ds257589.mlab.com:57589/waxstack";
    event.preventDefault();
    console.log(data);

    $.ajax({
      url: URL,
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function(data) {
        console.log("success");
      },
      error: function() {
        console.log("error");
      }
    });
  });
}

$(watchSubmit);
