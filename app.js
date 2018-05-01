

function watchSubmit() {
  $('#addRecord').submit(function(event) {
      event.preventDefault();
      console.log($(this).serialize());
  })
}

$(watchSubmit)