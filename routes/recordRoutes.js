const express = require("express");
const router = express.Router();
const {Record} = require("../models");
const helpers = require('../helpers/records');
const bodyParser = require("body-parser");


router.route('/') 
  .get(helpers.getRecords)
  .post(helpers.createRecord)

router.route('/:recordId')
  .put(helpers.updateRecord)
  .delete(helpers.deleteRecord)


module.exports = router