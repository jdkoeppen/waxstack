const { Record } = require("./models");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const express = require('express');
const router = express.Router();

router.get("/collection", (req, res) => {
  Record.find()
    .then(records => {
      res.json({
          records: records.map(
              (record) => record.serialize())
          });
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });

  router.post("/collection", (req, res) => {
      const requiredFields = ['artist', 'album', 'release'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
}
    Record.create(req.body)
      .then(function(record) {
        res.status(201).json(record.serialize());
      })
      .catch(function(err) {
        res.status(400).send(err.message);
      });
  });
});

router.put("/collection/:id", (req, res) => {
  Record.findOneAndUpdate(
    {
      _id: req.params.recordId
    },
    req.body
  )
    .then(function(record) {
      res.json(record.serialize());
    })
    .catch(function(err) {
      res.status(400).send(err.message);
    });
});

router.delete("/collection/:id", (req, res) => {
Record.remove({ _id: req.params.recordId }, req.body)
  .then(function() {
    res.json({ message: "Record Deleted" });
  })
  .catch(function(err) {
    res.send(err.message);
  });
});

module.exports = router;