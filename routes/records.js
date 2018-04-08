const express = require("express");
const router = express.Router();
const { Record } = require("../models");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

router.get("/", function(req, res) {
  Record.find()
    .then(function(records) {
      res.json(records);
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

router.post("/", jsonParser, function(req, res) {
  const requiredFields = ["artist", "album"]; //use Schema for arr population. Object.keys.map
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const record = Record.create(req.body)
    .then(function(record) {
      res.status(201).json(record);
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

module.exports = router;
