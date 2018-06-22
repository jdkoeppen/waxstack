// const LASTFM_URL = "https://ws.audioscrobbler.com/2.0/";
// const LASTFM_API = "493953a8e1e2743a17509153a4f85b8e";
// const MATCH_URL = "http://api.musixmatch.com/ws/1.1/album.get";
// const MATCH_API = "805a6e3e5f0a67743fd3508e57fcefc1";
var globalCollection;
var currentUser;
var userCollection;
var currentCollection;
var currentAlbumId;

/***
 *    ##     ## ######## #### ##        ######  
 *    ##     ##    ##     ##  ##       ##    ## 
 *    ##     ##    ##     ##  ##       ##       
 *    ##     ##    ##     ##  ##        ######  
 *    ##     ##    ##     ##  ##             ## 
 *    ##     ##    ##     ##  ##       ##    ## 
 *     #######     ##    #### ########  ######  
 */

$("#collectionTable").tablesorter({
  sortList: [
    [0, 0],
    [1, 0]
  ]
});


/***
 *     ######  ####  ######   ##    ## ##     ## ########  
 *    ##    ##  ##  ##    ##  ###   ## ##     ## ##     ## 
 *    ##        ##  ##        ####  ## ##     ## ##     ## 
 *     ######   ##  ##   #### ## ## ## ##     ## ########  
 *          ##  ##  ##    ##  ##  #### ##     ## ##        
 *    ##    ##  ##  ##    ##  ##   ### ##     ## ##        
 *     ######  ####  ######   ##    ##  #######  ##        
 */


function watchSignupLink() {
  $("#signupLink").click(function (event) {
    $("#loginCard").addClass("hidden");
    $("#signupCard").removeClass("hidden");
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
  $("#signupCard").addClass("hidden");
  $("#signupConf").removeClass("hidden");
}

function watchSignupConfirm() {
  $("#signupLogin").click(function (event) {
    $("#loginCard").removeClass("hidden");
    $("#signupConf").addClass("hidden");
  });
}

/***
 *    ##        #######   ######   #### ##    ## 
 *    ##       ##     ## ##    ##   ##  ###   ## 
 *    ##       ##     ## ##         ##  ####  ## 
 *    ##       ##     ## ##   ####  ##  ## ## ## 
 *    ##       ##     ## ##    ##   ##  ##  #### 
 *    ##       ##     ## ##    ##   ##  ##   ### 
 *    ########  #######   ######   #### ##    ## 
 */

function watchLogin() {
  $("#loginForm").submit(function (event) {
    let URL = "/api/auth/login";
    let userName = $("#loginUser").val();
    let password = $("#loginPassword").val();
    let data = {
      username: userName,
      password: password
    };
    event.preventDefault();
    $.ajax({
      contentType: "application/json",
      url: URL,
      type: "POST",
      data: JSON.stringify(data),
      success: function (data) {
        localStorage.setItem('authToken', data.authToken)
        currentUser = data.user;
        currentCollection = "user";
        $("#loginCard").addClass("hidden");
        $(".navbar").removeClass("hidden");
        $("#logo").addClass("hidden");
        $("#navMain").removeClass("hidden");
        $("#collectionDiv").removeClass("hidden");
        $("#collectionTable").removeClass("hidden");

        cacheCollection().then(getUserCol);
      },
      error: function (error) {
        let responseMessage = "Incorrect username or password.";
        $("#loginMsg").html(`<p style="color:red">${responseMessage}</p>`);
        console.log(responseMessage);
      }
    });
  });
}

/***
 *    ##     ##  ######  ######## ########  
 *    ##     ## ##    ## ##       ##     ## 
 *    ##     ## ##       ##       ##     ## 
 *    ##     ##  ######  ######   ########  
 *    ##     ##       ## ##       ##   ##   
 *    ##     ## ##    ## ##       ##    ##  
 *     #######   ######  ######## ##     ## 
 */

function getUserCol() {
  let URL = "/api/collection"
  let authToken = localStorage.getItem('authToken')
  $.ajax({
    xhrFields: {
      withCredentials: true
    },
    contentType: "application/json",
    url: URL,
    type: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    success: function (data) {
      userCollection = data;
      currentCollection = userCollection;
      renderCollection();
    },
    error: function () {
      console.log("error");
    }
  });
}

// function filteredCollection(collection, recordIds) {
//   return recordIds.map(recordId => collection.find(record => record._id === recordId)).filter(Boolean)
// }


/***
 *     ######     ###     ######  ##     ## ######## 
 *    ##    ##   ## ##   ##    ## ##     ## ##       
 *    ##        ##   ##  ##       ##     ## ##       
 *    ##       ##     ## ##       ######### ######   
 *    ##       ######### ##       ##     ## ##       
 *    ##    ## ##     ## ##    ## ##     ## ##       
 *     ######  ##     ##  ######  ##     ## ######## 
 */


function cacheCollection() {
  let URL = "/api/records";
  let authToken = localStorage.getItem('authToken')

  return $.ajax({
    xhrFields: {
      withCredentials: true
    },
    contentType: "application/json",
    url: URL,
    type: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    success: function (data) {
      globalCollection = data;
      // renderCollection();
    },
    error: function () {
      console.log("error");
    }
  });
}

/***
 *    ########  ######## ##    ## ########  ######## ########  
 *    ##     ## ##       ###   ## ##     ## ##       ##     ## 
 *    ##     ## ##       ####  ## ##     ## ##       ##     ## 
 *    ########  ######   ## ## ## ##     ## ######   ########  
 *    ##   ##   ##       ##  #### ##     ## ##       ##   ##   
 *    ##    ##  ##       ##   ### ##     ## ##       ##    ##  
 *    ##     ## ######## ##    ## ########  ######## ##     ## 
 */


function instructions() {
  if (!userCollection) {
    $('#instructions').removeClass('hidden')
  }
}

function globalCol() {
  $('#globeCol').on('click', function (event) {
    event.preventDefault();
    currentCollection = globalCollection;
    $(".tableContent").empty();
    renderCollection()
  })
}

function userCol() {
  $('#myCol').on('click', function (event) {
    event.preventDefault();
    currentCollection = userCollection;
    $(".tableContent").empty();
    renderCollection()
    $('#addChecked').addClass('hidden');

  })
}

function renderCollection() {
  $(".tableContent").empty();
  $.each(currentCollection.records, function (index, elem) {
    $("tbody").append(`<tr data-toggle='modal' data-target='#albumModal' data-idx='${index}' data-id='${elem._id}'><td class='checkable' ><input type='checkbox' role='checkbox' </td><td>${elem.artist}</td><td>${elem.album}</td><td>${elem.release}</td><td>${elem.label}</td><td>${elem.genre}</td><td>${elem.format}</td></tr>`);
  });
  instructions()
  $("#collectionTable").trigger("update")
}

/***
 *     ######  ##     ## ########  ######  ##    ##  ######  
 *    ##    ## ##     ## ##       ##    ## ##   ##  ##    ## 
 *    ##       ##     ## ##       ##       ##  ##   ##       
 *    ##       ######### ######   ##       #####     ######  
 *    ##       ##     ## ##       ##       ##  ##         ## 
 *    ##    ## ##     ## ##       ##    ## ##   ##  ##    ## 
 *     ######  ##     ## ########  ######  ##    ##  ######  
 */


function watchCheck() {
  $("table").on(
    "click",
    'td.checkable, td.checkable input[type="checkbox"]',
    function (event) {
      event.stopPropagation();
      let box = $(this).find("input[type='checkbox']");
      if (box.length) {
        box.prop("checked", !box.prop("checked"));
      }
    }
  );
}

function watchCheckAll() {
  $("table").on("change", "#checkAll", function (event) {
    $('td.checkable input[type="checkbox"]').prop(
      "checked",
      $(this).prop("checked")
    );
  });
}

/***
 *       ###    ########  ########  
 *      ## ##   ##     ## ##     ## 
 *     ##   ##  ##     ## ##     ## 
 *    ##     ## ##     ## ##     ## 
 *    ######### ##     ## ##     ## 
 *    ##     ## ##     ## ##     ## 
 *    ##     ## ########  ########  
 */

function watchAdd() {
  $("#addChecked").on("click", function (event) {
    let recordIds = [];
    let selected = $('td.checkable input[type="checkbox"]:checked');
    if (!selected.length) {
      return $.growl({
        location: "tc",
        size: "large",
        style: "warning",
        title: "Nothing Selected",
        message: "Please select at least one entry."
      });
    }
    selected.each(function () {
      let rowId = $(this).closest('tr').attr("data-id");
      recordIds.push(rowId);
    });
    console.log(recordIds);

    let authToken = localStorage.getItem('authToken')

    $.ajax({
      url: `/api/collection/`,
      xhrFields: {
        withCredentials: true
      },
      type: "PUT",
      data: JSON.stringify(recordIds),
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      success: function (collection) {
        console.log("SUCCESS", collection);
        $.growl({
          location: "tc",
          size: "large",
          style: "notice",
          title: "Records Added",
          message: `${recordIds.length} Selections Added to Your Collection Successfully.`
        });
        getUserCol().then(renderCollection)
      },
      error: function () {
        console.log("error", recordIds);
      }
    });
  });
}

/***
 *    ######## ########  #### ######## 
 *    ##       ##     ##  ##     ##    
 *    ##       ##     ##  ##     ##    
 *    ######   ##     ##  ##     ##    
 *    ##       ##     ##  ##     ##    
 *    ##       ##     ##  ##     ##    
 *    ######## ########  ####    ##    
 */

function albumEditOn() {
  $("#aModalEdit").addClass("hidden");
  $("#aModalSave, #aModalCxl, #aModalDelete").removeClass("hidden");
  $(".editable").each(function () {
    $(this)
      .attr("readonly", false)
      .addClass("inputEditing");
  });
}

function albumEditOff() {
  $(".editable").each(function () {
    $(this).removeClass("inputEditing");
    $(this).attr("readonly", true);
  });
  $("#aModalEdit").removeClass("hidden");
  $("#aModalSave, #aModalCxl, #aModalDelete").addClass("hidden");
}

/***
 *    ##     ## #### ######## ##      ## 
 *    ##     ##  ##  ##       ##  ##  ## 
 *    ##     ##  ##  ##       ##  ##  ## 
 *    ##     ##  ##  ######   ##  ##  ## 
 *     ##   ##   ##  ##       ##  ##  ## 
 *      ## ##    ##  ##       ##  ##  ## 
 *       ###    #### ########  ###  ###  
 */

function watchAlbumModal() {
  $("#albumModal").on("show.bs.modal", function (event) {
    var selection = $(event.relatedTarget);
    var x = selection.data("idx");
    var elem =
     currentCollection.records[x];
    currentAlbumId = elem._id;
    var noCover = "assets/nocover.png";
    var cover = elem.cover ? elem.cover : noCover;
    var modal = $(this);
    modal.find("#aModalId").val(elem._id);
    modal.find("#aModalImg").attr("src", cover);
    modal.find("#aModalArtist").val(elem.artist);
    modal.find("#aModalAlbum").val(elem.album);
    modal.find("#aModalRel").val(elem.release);
    modal.find("#aModalLab").val(elem.label);
    modal.find("#aModalGen").val(elem.genre);
    modal.find("#aModalForm").val(elem.format);
    $.each(elem.tracks, function (idx, name) {
      modal
        .find("#aModalTracks")
        .append(
          `<li><input type='text' readonly class='form-control-plaintext editable' value='${name.name}'</input></li>`
        );
    });
  });
  $("#albumModal").on("hidden.bs.modal", function (event) {
    albumEditOff();
    $(this)
      .find("#aModalTracks")
      .empty();
    $("#albumModal").modal("dispose");
    $("#collectionTable").trigger("update");
  });
}

function watchAlbumEdit() {
  $("#albumModal").on("click", "#aModalEdit", function (event) {
    albumEditOn();
    $("#albumModal").modal("handleUpdate");
  });

  $(this).on("click", "#aModalCxl", function (event) {
    albumEditOff();
    $("#albumModal").modal("handleUpdate");
  });

  /***
   *     ######     ###    ##     ## ######## 
   *    ##    ##   ## ##   ##     ## ##       
   *    ##        ##   ##  ##     ## ##       
   *     ######  ##     ## ##     ## ######   
   *          ## #########  ##   ##  ##       
   *    ##    ## ##     ##   ## ##   ##       
   *     ######  ##     ##    ###    ######## 
   */

  $("#albumModal").on("click", "#aModalSave", function (event) {
    event.preventDefault();
    let data = {};
    let input = $(this)
      .closest("form")
      .serializeArray();
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
    let authToken = localStorage.getItem('authToken')

    $.ajax({
      url: `/api/records/${currentAlbumId}`,
      xhrFields: {
        withCredentials: true
      },
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      success: function (data) {
        console.log("SUCCESS", data);
        albumEditOff();
        $.growl({
          location: "tc",
          size: "large",
          style: "notice",
          title: "Saved",
          message: "Updates Saved Successfully."
        });
        cacheCollection().then(getUserCol).then(function () {
          $("#collectionTable").trigger("update")
        });
      },
      error: function () {
        console.log("error", data);
      }
    });
  });

  /***
   *    ########  ######## ##       ######## ######## ######## 
   *    ##     ## ##       ##       ##          ##    ##       
   *    ##     ## ##       ##       ##          ##    ##       
   *    ##     ## ######   ##       ######      ##    ######   
   *    ##     ## ##       ##       ##          ##    ##       
   *    ##     ## ##       ##       ##          ##    ##       
   *    ########  ######## ######## ########    ##    ######## 
   */

  $("#albumModal").on("click", "#aModalDelete", function (event) {
    event.preventDefault();
    let authToken = localStorage.getItem('authToken')

    $.ajax({
      url: `/api/collection/${currentAlbumId}`,
      xhrFields: {
        withCredentials: true
      },
      type: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      success: function () {
        console.log("DELETED");
        $.growl({
          location: "tc",
          size: "large",
          style: "warning",
          title: "Delete",
          message: "Record Deleted Successfully."
        });
        albumEditOff();
        $("#albumModal").modal("hide");
        cacheCollection().then(getUserCol).then(function () {
          $("#collectionTable").trigger("update")
        });
      },
      error: function () {
        console.log("error");
      }
    });
  });
}

/***
 *    ######## ########     ###     ######  ##    ## 
 *       ##    ##     ##   ## ##   ##    ## ##   ##  
 *       ##    ##     ##  ##   ##  ##       ##  ##   
 *       ##    ########  ##     ## ##       #####    
 *       ##    ##   ##   ######### ##       ##  ##   
 *       ##    ##    ##  ##     ## ##    ## ##   ##  
 *       ##    ##     ## ##     ##  ######  ##    ## 
 */

function addTrack() {
  $("#addTrack").on("click", function (event) {
    var addTrack = $("#addTrack");
    var wrap = $(".trackWrap");
    var trackHtml = `<div class="trackRow input-group input-group-options col-xs-11"><input type="text" name="tracks" class="form-control" placeholder="Track"/><div class="input-group-append"><span class="input-group-text" id="deleteTrack"><i class="fas fa-times"></i></span></div></div>`;
    event.preventDefault;
    $(wrap).append(trackHtml);
  });

  $(".trackWrap").on("click", ".input-group-append", function (event) {
    $(this)
      .parent("div")
      .remove();
  });
}

/***
 *    ##    ## ######## ##      ## 
 *    ###   ## ##       ##  ##  ## 
 *    ####  ## ##       ##  ##  ## 
 *    ## ## ## ######   ##  ##  ## 
 *    ##  #### ##       ##  ##  ## 
 *    ##   ### ##       ##  ##  ## 
 *    ##    ## ########  ###  ###  
 */

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
    }));
    console.log(data);
    let authToken = localStorage.getItem('authToken')

    $.ajax({
      url: URL,
      xhrFields: {
        withCredentials: true
      },
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      success: function (data) {
        console.log("success");
        alert("Record Added");
        $("#addRecordModal").modal("hide");
        cacheCollection().then(getUserCol).then(function () {
          $("#collectionTable").trigger("update")
        });
      },
      error: function () {
        console.log("error");
      }
    });
  });

  $("#addRecordModal").on("hidden.bs.modal", function () {
    $("#addRecord").each(function () {
      $(this)
        .closest("form")
        .find("input[type=text], textarea")
        .val("");
      $(".trackRow").empty();
    });
  });
}

/***
 *     #######  ##    ## ##        #######     ###    ########  
 *    ##     ## ###   ## ##       ##     ##   ## ##   ##     ## 
 *    ##     ## ####  ## ##       ##     ##  ##   ##  ##     ## 
 *    ##     ## ## ## ## ##       ##     ## ##     ## ##     ## 
 *    ##     ## ##  #### ##       ##     ## ######### ##     ## 
 *    ##     ## ##   ### ##       ##     ## ##     ## ##     ## 
 *     #######  ##    ## ########  #######  ##     ## ########  
 */

$(watchLogin);
$(recordSubmit);
$(addTrack);
$(watchSignupLink);
$(watchSignup);
$(userCol);
$(globalCol);
$(watchSignupConfirm);
$(watchAlbumModal);
$(watchAlbumEdit);
$(watchCheck);
$(watchCheckAll);
$(watchAdd);