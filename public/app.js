function watchSubmit() {
  $("#addRecord").submit(function(event) {
    let URL = "http://localhost:8080/collection";
    event.preventDefault();
     var data = {};
     var input = $(this).serializeArray();
     $.each(input, function() {
       if (data[this.name]) {
         if (!data[this.name].push) {
           data[this.name] = [data[this.name]];
         }
         data[this.name].push(this.value || "");
       } else {
         data[this.name] = this.value || "";
       }
     });
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
