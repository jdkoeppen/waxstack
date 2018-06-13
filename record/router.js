const {Record} = require("./models");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const express = require("express");
const router = express.Router();
const {Collection} = require('../collection')

router.get("/", (req, res) => {
  return Record.find()
    .then(records => {
      res.json({
        records: records.map(record => record)
      });
    })
    .catch(err => res.status(400).send(err.message));
});

router.get("/search", (req, res) => {
  return Record.find({'artist':req.query.artist})
    .then(record => {
      res.json(record)
    })
    .catch(err => res.status(404).send(err.message))
})

router.post("/", jsonParser, (req, res) => {
  console.log(req.body)
  Record.create(req.body)
    .then(function (record) {
     return Collection.findOneAndUpdate({userId: req.user._id}, {$set: {$push: {tracks: record._id}}})
      .then(function() {
        res.status(201).json(record)
      })
    })
    .catch(function (err) {
      console.log(err.message)
      res.status(400).send(err.message);
    });
});

router.put("/:id", jsonParser, (req, res) => {
  Record.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body
    }, {
      new: true
    })
    .then(function (record) {
      res.json(record);
    })
    .catch(function (err) {
      res.status(400).send(err.message);
    });
});

router.delete("/:id", (req, res) => {
  Record.remove({
      _id: req.params.id
    }, req.body)
    .then(function () {
      res.json({
        message: "Record Deleted"
      });
    })
    .catch(function (err) {
      res.send(err.message);
    });
});

module.exports = router;