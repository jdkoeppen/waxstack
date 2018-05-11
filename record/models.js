const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const recordSchema = new mongoose.Schema({
  artist: String,
  album: String,
  release: String,
  label: String,
  genre: String,
  tracks: [{
      rank: Number,
      name: String
    },
  ],
  format: String,
  cover: String
});

const Record = mongoose.model("Record", recordSchema);
module.exports = {Record};
 