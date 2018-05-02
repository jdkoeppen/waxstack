function watchSubmit() {
  $("#addRecord").submit(function(event) {
    let data = $(this).serializeArray();
    let URL = "mongodb://localhost:27017/waxstack";
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
