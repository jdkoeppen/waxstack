const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/record-api');

mongoose.Promise = global.Promise;

module.exports.Record = require('./record');
