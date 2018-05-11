var mbidArray = [];
var releaseArray = [];
var list = {};
var finalArray = [];
// const convert = require('xml-js');
const LASTFM_URL = "https://ws.audioscrobbler.com/2.0/";
const LASTFM_API = "493953a8e1e2743a17509153a4f85b8e";
const MATCH_URL = "http://api.musixmatch.com/ws/1.1/album.get";
const MATCH_API = "805a6e3e5f0a67743fd3508e57fcefc1";

function enterTracks() {
  $(document).on(
    "focus",
    "div.form-group-options div.input-group-option:last-child input",
    function() {
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
    function() {
      $(this)
        .parent()
        .remove();
    }
  );
}

function watchSeed() {
  $("#seed1").click(function(event) {
    event.preventDefault();
    let query = {
      method: "user.gettopalbums",
      user: "jdkoeppen",
      api_key: LASTFM_API,
      limit: 100,
      format: "json"
    };

    $.getJSON(LASTFM_URL, query).done(function(getTopAlbums) {
      // console.log(getTopAlbums)
      for (i = 0; i < getTopAlbums.topalbums.album.length; i++) {
        if (getTopAlbums.topalbums.album[i].mbid) {
          mbidArray.push(getTopAlbums.topalbums.album[i].mbid);
        }
      }
      console.log(mbidArray);
    });
  });
}

function seedTwo() {
  $("#seed2").click(function(event) {
    for (x = 0; x < mbidArray.length; x++) {
      let query = {
        apikey: MATCH_API,
        album_mbid: mbidArray[x]
      };

      $.getJSON(MATCH_URL, query).done(function(output) {
        // console.log(output);
        let albumMbid = output.message.body.album.album_mbid;
        let albumName = output.message.body.album.album_name;
        let releaseYear = output.message.body.album.album_release_date.slice(
          0,
          4
        );
        let albumLabel = output.message.body.album.album_label;
        // let albumGenre = output.message.body.album.primary_genres.music_genre_list.music_genre.music_genre_name
        if (output.message.body.album.album_release_date) {
          releaseArray.push({
            album: albumName,
            release: releaseYear,
            mbid: albumMbid,
            label: albumLabel
            // genre: albumGenre,
          });
        }
      });
    }
    console.log(releaseArray);
  });
}

function seedThree() {
  $("#seed3").click(function(event) {
    console.log(releaseArray.length);
    for (n = 0; n < releaseArray.length; n++) {
      let albumMbid = releaseArray[n].mbid;
      let query1 = {
        method: "album.getinfo",
        mbid: albumMbid,
        api_key: LASTFM_API,
        format: "json"
      };

      $.getJSON(LASTFM_URL, query1).done(function(finalData) {
        finalArray.push(finalData);
        let coverUrl = finalData.album.image.find(x => x.size === "extralarge")['#text']
        let releaseString = releaseArray.find(x => x.mbin === finalData.mbin).release;
        let labelString = releaseArray.find(x => x.mbin === finalData.mbin).label;

        let seedSchema = {
          artist: finalData.album.artist,
          album: finalData.album.name,
          release: releaseString,
          label: String,
          genre: String,
          tracks: finalData.album.tracks.track.map(obj => ({
            rank: obj["@attr"].rank,
            name: obj.name
          })),
          format: String,
          cover: coverUrl
        };

        list[finalData.album.mbid] = JSON.stringify(seedSchema)
      });
    }
    console.log('finalArray: ',finalArray)
    console.log('list JSON: ',JSON.stringify(list));
    console.log('list: ', list)
  });
}

function watchLogin() {}

function watchSignupLink() {
  $("#signupLink").click(function(event) {
    $("#loginCard").css("display", "none");
    $("#signupCard").css("display", "flex");
  });
}

function watchSignup() {
  $("#signupForm").submit(function(event) {
    let URL = "http://localhost:8080/users";
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
        signupConfirm();
        console.log("success");
      },
      error: function(jqXHR) {
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
$(watchSignupLink);
$(watchSignup);
$(enterTracks);
$(watchSeed);
$(seedTwo);
$(seedThree);
$(watchSignupConfirm)
// $(seedList)
