// const LASTFM_URL = "https://ws.audioscrobbler.com/2.0/";
// const LASTFM_API = "493953a8e1e2743a17509153a4f85b8e";
// const MATCH_URL = "http://api.musixmatch.com/ws/1.1/album.get";
// const MATCH_API = "805a6e3e5f0a67743fd3508e57fcefc1";
var currentCollection;
var currentAlbumId;

$("#collectionTable").tablesorter({
  sortList: [
    [0, 0],
    [1, 0]
  ]
})

function watchLogin() {
  $('#loginForm').submit(function (event) {
    let URL = "/api/auth/login";
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
    let URL = "http://localhost:8080/api/users";
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

function cacheCollection() {
  let URL = '/api/records'
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
    currentAlbumId = elem._id;
    var modal = $(this)
    modal.find('#aModalId').val(elem._id)
    modal.find('#aModalImg').attr("src", elem.cover);
    modal.find('#aModalArtist').val(elem.artist);
    modal.find('#aModalAlbum').val(elem.album);
    modal.find('#aModalRel').val(elem.release);
    modal.find('#aModalLab').val(elem.label);
    modal.find('#aModalGen').val(elem.genre);
    modal.find('#aModalForm').val(elem.format);
    $.each(elem.tracks, function (idx, name) {
      modal.find('#aModalTracks').append("<li><input type='text' readonly class='form-control-plaintext editable' value='" + name.name + "'</input></li>")
    })
  })
  $('#albumModal').on('hidden.bs.modal', function (event) {
    $(this).find('#aModalTracks').empty()
    $('#albumModal').modal('dispose')
    $('#collectionTable').trigger("update")
  })
}

function albumEditOn() {
  $('#aModalEdit').addClass('hidden');
  $('#aModalSave, #aModalCxl, #aModalDelete').removeClass('hidden');
  $(".editable").each(function () {
    $(this).removeAttr('readonly').removeClass('form-control-plaintext').addClass('inputEditing')
  });
}

function albumEditOff() {
  $('.editable').each(function () {
    $(this).removeClass('inputEditing').addClass('form-control-plaintext').attr('readonly')
  });
  $('#aModalEdit').removeClass('hidden');
  $('#aModalSave, #aModalCxl, #aModalDelete').addClass('hidden');
}

function watchAlbumEdit() {
  $('#albumModal').on('click', '#aModalEdit', function (event) {
    albumEditOn()
  })

  $(this).on('click', '#aModalCxl', function (event) {
    albumEditOff()
  });

  $('#albumModal').on('click', '#aModalSave', function (event) {
    event.preventDefault();
    let data = {};
    let input = $(this).closest('form').serializeArray();
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

    $.ajax({
      url: `/api/records/${currentAlbumId}`,
      xhrFields: {
        withCredentials: true
      },
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (data) {
        console.log("SUCCESS", data);
        albumEditOff();
        cacheCollection()
      },
      error: function () {
        console.log("error", data);
      }
    })
  })

  $('#albumModal').on('click', '#aModalDelete', function (event) {
    event.preventDefault();
    $.ajax({
      url: `/api/records/${currentAlbumId}`,
      xhrFields: {
        withCredentials: true
      },
      type: "DELETE",
      success: function () {
        console.log("DELETED");
        albumEditOff();
        cacheCollection()
      },
      error: function () {
        console.log("error")
      }
    })
  })
}

function enterTracks() {
  $('#addRecordModal').on("show.bs.modal", function () {
    var x = 1
    var addTrack = $('#addTrack')
    var wrap = $('.trackWrap')
    var trackHtml = `<div class="trackRow input-group input-group-options col-xs-11"><input type="text" name="tracks" class="form-control" placeholder="Track"/><div class="input-group-append"><span class="input-group-text" id="deleteTrack"><i class="fas fa-times"></i></span></div></div>`

    $('#addTrack').on('click', function (event) {
      event.preventDefault;
      x++;
      $(wrap).append(trackHtml);
    })

    $(wrap).on('click', '.input-group-append', function (event) {
      x--;
      $(this).parent('div').remove();
    })
  });
}

function clearRecordModal() {
  $('#addRecordModal').modal('hide.bs.modal', function (event) {
    $('#addRecord').each(function () {
      this.reset();
    });
  })
}

function recordSubmit() {
  $("#addRecord").submit(function (event) {
    let URL = "/api/records";
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
    data.tracks = data.tracks.map((name, rank) => ({
      name,
      rank: rank + 1
    }))
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
        cacheCollection()
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
$(watchAlbumModal)
$(watchAlbumEdit)
// $(cacheCollection);
// $(renderCollection);
// $(sortCollection);