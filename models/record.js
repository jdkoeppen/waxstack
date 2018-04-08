const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const recordSchema =  new mongoose.Schema({
    artist: {
        type: String,
        required: 'Artist name cannot be blank'
    },
    album: {
        type: String,
        required: 'Album name cannot be blank'
    },
    release: Date,
    label: String,
    genre: String,
    tracks: [String],
    tags: {
        type: ObjectId,
        ref: "Tag",
      },  //storing and querying tags? in search on array?
    //for db of tags: full object type: object ID (mongoose.Schema.Types.ObjectId)
    cover:{
        frontUrl: String,
        backUrl: String
    }, 
});

const Record = mongoose.model('Record', recordSchema);
module.exports = Record;