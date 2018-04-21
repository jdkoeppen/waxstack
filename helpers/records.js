const {Record} = require('../models');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

exports.getRecords = function(req, res) {
    Record.find()
    .then(function (records) {
      res.json(records);
    })
    .catch(function (err) {
      res.status(400).send(err.message)
    })
}

exports.createRecord = (jsonParser, function (req, res) { 
  // const requiredFields = ["artist", "album"]; //use Schema for arr population. Object.keys.map
  // for (let i = 0; i < requiredFields.length; i++) {
  //   const field = requiredFields[i];
  //   if (!(field in req.body)) {
  //     const message = `Missing \`${field}\` in request body`;
  //     console.error(message);
  //     return res.status(400).send(message);
  //   }
  // }

  const record = Record.create(req.body)
    .then(function (record) {
      res.status(201).json(record);
    })
    .catch(function (err) {
      res.status(400).send(err.message);
    });
})

exports.updateRecord = function (req, res) {
  Record.findOneAndUpdate({
      _id: req.params.recordId
    }, req.body)
    .then(function (record) {
      res.json(record)
    })
    .catch(function (err) {
      res.status(400).send(err.message);
    })
}

exports.deleteRecord = function(req, res) {
  Record.remove({ _id: req.params.recordId }, req.body)
    .then(function() {
      res.json({ message: "Record Deleted" });
    })
    .catch(function(err) {
      res.send(err.message);
    });
};

