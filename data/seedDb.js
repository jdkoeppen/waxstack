function watchSeed() {
    $("#seed1").click(function (event) {
        event.preventDefault();
        let query = {
            method: "user.gettopalbums",
            user: "jdkoeppen",
            api_key: LASTFM_API,
            limit: 100,
            format: "json"
        };

        $.getJSON(LASTFM_URL, query).done(function (getTopAlbums) {
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
    $("#seed2").click(function (event) {
        for (x = 0; x < mbidArray.length; x++) {
            let query = {
                apikey: MATCH_API,
                album_mbid: mbidArray[x]
            };

            $.getJSON(MATCH_URL, query).done(function (output) {
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
    $("#seed3").click(function (event) {
        console.log(releaseArray.length);
        for (n = 0; n < releaseArray.length; n++) {
            let albumMbid = releaseArray[n].mbid;
            let query1 = {
                method: "album.getinfo",
                mbid: albumMbid,
                api_key: LASTFM_API,
                format: "json"
            };

            $.getJSON(LASTFM_URL, query1).done(function (finalData) {
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

                list[finalData.album.mbid] = seedSchema
            });
        }
        console.log('finalArray: ', finalArray)
        // console.log('list: ', finalList)
    });
}

var arrayFromList = Object.keys(list).map(key => list[key]);
// const finalList = JSON.stringify(arrayFromList)