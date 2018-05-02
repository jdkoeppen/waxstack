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
        console.log("success --> data :", data);
      },
      error: function(xhr, text, err) {
        console.log("error: ", err);
        console.log("text: ", text);
        console.log("xhr: ", xhr);
        console.log(
          "there is a problem with your request, please check ajax request"
        );
      }
    });
  });
}

$(watchSubmit);
