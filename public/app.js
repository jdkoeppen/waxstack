// const LASTFM_URL = "https://ws.audioscrobbler.com/2.0/";
// const LASTFM_API = "493953a8e1e2743a17509153a4f85b8e";
// const MATCH_URL = "http://api.musixmatch.com/ws/1.1/album.get";
// const MATCH_API = "805a6e3e5f0a67743fd3508e57fcefc1";
var currentCollection;

$("#collectionTable").tablesorter({
  sortList: [
    [0, 0],
    [1, 0]
  ]
})


function enterTracks() {
  $(document).on(
    "focus",
    "div.form-group-options div.input-group-option:last-child input",
    function () {
      var sInputGroupHtml = $(this)
        .parent()
        .html();
      var sInputGroupClasses = $(this)
        .parent()
        .attr("class");
      $(this)
        .parent()
        .parent()
        .append('<div class="' +
          sInputGroupClasses +
          '">' +
          sInputGroupHtml +
          "</div>"
        );
    }
  );
  $(document).on(
    "click",
    "div.form-group-options .input-group-addon-remove",
    function () {
      $(this)
        .parent()
        .remove();
    }
  );
}

function watchLogin() {
  $('#loginForm').submit(function (event) {
    let URL = "http://localhost:8080/api/auth/login";
    let userName = $('#loginUser').val();
    let password = $('#loginPassword').val();
    let data = {
      'username': userName,
      'password': password
    }
    event.preventDefault()
    $.ajax({
      contentType: 'application/json',
      url: URL,
      type: "POST",
      data: JSON.stringify(data),
      success: function (data) {
        var currentCollection = data.records
        console.log('Success')
        $("#loginCard").addClass('hidden')
        $('#btnMain').removeClass('hidden')
        $('#collectionDiv').removeClass('hidden')
        $('#collectionTable').removeClass('hidden')

        cacheCollection();
      },
      error: function (error) {
        let responseMessage = "Something Went Wrong.";
        $("#loginMsg").html(`<p style="color:red">${responseMessage}</p>`);
        console.log(responseMessage);
      }
    })
  })
}

function watchSignupLink() {
  $("#signupLink").click(function (event) {
    $("#loginCard").addClass('hidden')
    $("#signupCard").removeClass('hidden');
  });
}

function watchSignup() {
  $("#signupForm").submit(function (event) {
    let URL = "http://localhost:8080/users";
    event.preventDefault();
    let data = {};
    let input = $(this).serializeArray();
    $.each(input, function () {
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
      success: function (data) {
        signupConfirm();
        console.log("success");
      },
      error: function (jqXHR) {
        let responseMessage = jqXHR.responseJSON.message;
        $("#signupMsg").html(`<p style="color:red">${responseMessage}</p>`);
        console.log("status: " + jqXHR.status);
        console.log(responseMessage);
      }
    });
  });
}

function signupConfirm() {
  $('#signupCard').addClass('hidden')
  $('#signupConf').removeClass('hidden')
}

function watchSignupConfirm() {
  $("#signupLogin").click(function (event) {
    $("#loginCard").removeClass('hidden');
    $("#signupConf").addClass('hidden')
  });
}

function watchAddRecord() {
  $('#addRecordBtn').click(function (event) {

  })
}

function cacheCollection() {
  let URL = 'http://localhost:8080/api/records'
  $.ajax({
    xhrFields: {
      withCredentials: true
    },
    contentType: 'application/json',
    url: URL,
    type: "GET",
    success: function (data) {
      currentCollection = data
      renderCollection()
    },
    error: function () {
      console.log("error");
    }
  })
}

function renderCollection() {
  $.each(currentCollection.records, function (idx, elem) {
    $('tbody').append(
      "<tr data-toggle='modal' data-target='#albumModal' data-idx='" + idx + "'><td>" + elem.artist + "</td><td>" + elem.album + "</td><td>" + elem.release + "</td><td>" + elem.label + "</td><td>" + elem.genre + "</td><td>" + elem.format + "</td></tr>")
  })
  $('#collectionTable').trigger("update")
}


function watchAlbumModal() {
  $('#albumModal').on('show.bs.modal', function (event) {
    var selection = $(event.relatedTarget)
    var x = selection.data('idx')
    var elem = currentCollection.records[x]
    var modal = $(this)
    modal.find('#aModalId').text(x)
    modal.find('#aModalImg').attr("src", elem.cover);
    modal.find('#aModalArtist').text(elem.artist);
    modal.find('#aModalAlbum').text(elem.album);
    modal.find('#aModalDets').text(elem.release + " | " + elem.label + " | " + elem.genre);
    $.each(elem.tracks, function (idx, name) {
      modal.find('#aModalTracks').append("<li class='editable'>" + name.name + "</li>")
    })
  })
  $('#albumModal').on('hidden.bs.modal', function(event) {
    $(this).find('#aModalTracks').empty()
    $('#albumModal').modal('dispose')
  })
}

function watchAlbumEdit() {
  $('#albumModal').on('click', '#aModalEdit', function (event) {
    $('#aModalEdit').addClass('hidden');
    $('#aModalSave, #aModalCxl, #aModalDelete').removeClass('hidden');
    $(".editable").each(function () {
      var field = $(this);
      field.addClass('highlight')
      field.after("<input type = 'text' style = 'display:none' />");
      var textbox = $(this).next();
      textbox[0].name = this.id.replace("lbl", "txt");
      textbox.val(field.html());
      //toggle editing class on form
      field.click(function () {
        $(this).hide();
        $(this).next().show();
      });
      textbox.focusout(function () {
        $(this).hide();
        $(this).prev().html($(this).val());
        $(this).prev().show();
      });
    });
  })
  $(this).on('click', '#aModalCxl', function (event) {
    $('.editable').each(function() {
      $(this).removeClass('highlight')
    })
    $('#aModalEdit').removeClass('hidden');
    $('#aModalSave, #aModalCxl, #aModalDelete').addClass('hidden');
  });

  $(this).on('submit', '#aModalSave', function (event) {
    let URL = "http://localhost:8080/records";
    event.preventDefault()
    let data = {}
    let input = $(this).serializeArray();
    
    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      type:"PUT",
      data: JSON.stringify(data),
      contentType: "application/json",
    })
  })

}


function recordSubmit() {
  $("#addRecord").submit(function (event) {
    let URL = "http://localhost:8080/records";
    event.preventDefault();
    let data = {};
    let input = $(this).serializeArray();
    $.each(input, function () {
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
      xhrFields: {
        withCredentials: true
      },
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (data) {
        console.log("success");

        $('#addRecordModal').modal('dispose')
        $('#collectionTable').trigger("update")
      },
      error: function () {
        console.log("error");
      }
    });
  });
}

// $(onLoad);
$(watchLogin);
$(recordSubmit);
$(watchSignupLink);
$(watchSignup);
$(enterTracks);
$(watchSignupConfirm);
$(watchAddRecord);
$(watchAlbumModal)
$(watchAlbumEdit)
// $(cacheCollection);
// $(renderCollection);
// $(sortCollection);