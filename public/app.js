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

/***
 *        __                  _      
 *       / /   ____   ____ _ (_)____ 
 *      / /   / __ \ / __ `// // __ \
 *     / /___/ /_/ // /_/ // // / / /
 *    /_____/\____/ \__, //_//_/ /_/ 
 *                 /____/            
 */

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

/***
 *       _____  _                           
 *      / ___/ (_)____ _ ____   __  __ ____ 
 *      \__ \ / // __ `// __ \ / / / // __ \
 *     ___/ // // /_/ // / / // /_/ // /_/ /
 *    /____//_/ \__, //_/ /_/ \__,_// .___/ 
 *             /____/              /_/      
 */

function watchSignupLink() {
  $("#signupLink").click(function (event) {
    $("#loginCard").addClass('hidden')
    $("#signupCard").removeClass('hidden');
  });
}

function watchSignup() {
  $("#signupForm").submit(function (event) {
    let URL = "/api/users";
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

/***
 *       ______              __        
 *      / ____/____ _ _____ / /_   ___ 
 *     / /    / __ `// ___// __ \ / _ \
 *    / /___ / /_/ // /__ / / / //  __/
 *    \____/ \__,_/ \___//_/ /_/ \___/ 
 *                                     
 */

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

/***
 *        ____                    __           
 *       / __ \ ___   ____   ____/ /___   _____
 *      / /_/ // _ \ / __ \ / __  // _ \ / ___/
 *     / _, _//  __// / / // /_/ //  __// /    
 *    /_/ |_| \___//_/ /_/ \__,_/ \___//_/     
 *                                             
 */

function renderCollection() {
  $('.tableContent').empty();
  $.each(currentCollection.records, function (idx, elem) {
    $('tbody').append(
      "<tr data-toggle='modal' data-target='#albumModal' data-idx='" + idx + "'><td>" + elem.artist + "</td><td>" + elem.album + "</td><td>" + elem.release + "</td><td>" + elem.label + "</td><td>" + elem.genre + "</td><td>" + elem.format + "</td></tr>")
  })
  $('#collectionTable').trigger("update")
}

/***
 *        ___     __ __                         __  ___            __        __
 *       /   |   / // /_   __  __ ____ ___     /  |/  /____   ____/ /____ _ / /
 *      / /| |  / // __ \ / / / // __ `__ \   / /|_/ // __ \ / __  // __ `// / 
 *     / ___ | / // /_/ // /_/ // / / / / /  / /  / // /_/ // /_/ // /_/ // /  
 *    /_/  |_|/_//_.___/ \__,_//_/ /_/ /_/  /_/  /_/ \____/ \__,_/ \__,_//_/   
 *                                                                             
 */

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
        alert("Updates Saved");
        cacheCollection()
        $("#collectionTable").trigger("update");
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
        alert("Entry Deleted");
        albumEditOff();
        cacheCollection()
        $("#collectionTable").trigger("update");
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
        alert("Record Added")
        $('#addRecordModal').modal('hide')
        cacheCollection()
        $("#collectionTable").trigger("update");
      },
      error: function () {
        console.log("error");
      }
    });
  });
}

$(watchLogin);
$(recordSubmit);
$(watchSignupLink);
$(watchSignup);
$(enterTracks);
$(watchSignupConfirm);
$(watchAlbumModal)
$(watchAlbumEdit)
