'use strict'
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const app = express();

