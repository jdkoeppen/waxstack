function enterTracks() {
  $(document).on('focus', 'div.form-group-options div.input-group-option:last-child input', function () {
    var sInputGroupHtml = $(this).parent().html();
    var sInputGroupClasses = $(this).parent().attr('class');
    $(this).parent().parent().append('<div class="' + sInputGroupClasses + '">' + sInputGroupHtml + '</div>');
  });
  $(document).on('click', 'div.form-group-options .input-group-addon-remove', function () {
    $(this).parent().remove();
  });
};

function watchSubmit() {
  $("#addRecord").submit(function(event) {
    let URL = "http://localhost:8080/collection";
    event.preventDefault();
     let data = {};
     let input = $(this).serializeArray();
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
$(enterTracks);
