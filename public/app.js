const LASTFM_URL = "https://ws.audioscrobbler.com/2.0/";
const LASTFM_API = "493953a8e1e2743a17509153a4f85b8e";
const MATCH_URL = "http://api.musixmatch.com/ws/1.1/album.get";
const MATCH_API = "805a6e3e5f0a67743fd3508e57fcefc1";

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
        .append(
          '<div class="' +
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
  $('#loginButton').click(function (event) {
    let URL = "http://localhost:8080/api/auth/login";
    let userName = $('#loginUser').val();
    let password = $('#loginPassword').val();
    let data = {'username': userName, 'password': password}
    event.preventDefault()
    $.ajax({
      url: URL,
      type: "POST",
      .
      data: data,
      success: function (data) {
        console.log('Success')
        $("#loginCard").css("display", "none");
        $('#collectionTable').css("display: flex");
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
    $("#loginCard").css("display", "none");
    $("#signupCard").css("display", "flex");
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
  $('#signupCard').css("display", "none");
  $('#signupConf').css("display", "flex")
}

function watchSignupConfirm() {
  $("#signupLogin").click(function (event) {
    $("#loginCard").css("display", "flex");
    $("#signupConf").css("display", "none");
  });
}

function renderCollection () {
  $('#populate').on('click', function(event) {
    let URL = 'http://localhost:8080/api/records'
    $.ajax({
      url: URL,
      type: "GET",
      success: function(response) {
        for(i=0; i < response.length; i++) {

        }
        $("table tr:first").after()
      }
    })
  })

}

function recordSubmit() {
  $("#addRecord").submit(function (event) {
    let URL = "http://localhost:8080/collection";
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
        console.log("success");
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
$(watchSignupConfirm)