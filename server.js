const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const router = require('./routes')

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");

const app = express();

app.use(morgan("common"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

app.use('/collection', router.recordRoutes); 

app.get("/", function(req, res) {
  res.json("I am receiving you.");
});

let server;

function startServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      console.log("Connected to db " + DATABASE_URL);
      server = app
        .listen(port, () => {
          console.log("App is listening on port " + port);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing Server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  startServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, startServer, closeServer};