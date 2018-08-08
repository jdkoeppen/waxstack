const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const collectionSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  records: [{
    type: ObjectId,
    ref: 'Record'
  }]
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = {
  Collection
};