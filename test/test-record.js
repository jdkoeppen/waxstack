const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const {
  app,
  runServer,
  closeServer
} = require("../server");
const {
  PORT,
  TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);

describe("record object", function () {
  before(function () {
    return runServer(TEST_DATABASE_URL)

    after(function () {
      return closeServer();
    });

    it("should POST a record given proper input", function () {
      const newRecord = {
        artist: "Jamiroquai",
        album: "Soundstage Landscape",
        release: "1998",
        genre: "Funny Hats",
        label: "Moving Floor Records"
      };
      const expectedKeys = ["_id", "tracks", "__v"].concat(Object.keys(newRecord));

      return chai
        .request(app)
        .post("/api/records")
        .send(newRecord)
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res).to.be.a("object");
          expect(res.body).to.have.all.keys(expectedKeys);
          expect(res.body.artist).to.equal(newRecord.artist);
          expect(res.body.album).to.equal(newRecord.album);
          expect(res.body.release).to.equal(newRecord.release);
          expect(res.body.genre).to.equal(newRecord.genre);
          expect(res.body.label).to.equal(newRecord.label);
        });

      it("should error if POST does not contain expected keys", function () {
        const badRequestData = {};
        return chai
          .request(app)
          .post("/")
          .send(badRequestData)
          .catch(function (res) {
            expect(res).to.have.status(400);
          });
      });
    });

    it("should GET a collection of Records", function () {
      return chai.request(app)
        .get("/")
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res).to.be.a("array")
          expect(res).to.have.length.of.at.least(1);
        });

    });

    it("should PUT a user edit to an existing record given a valid ID", function () {

    });

    it("should DELETE a record given a valid ID", function () {});
  });
})