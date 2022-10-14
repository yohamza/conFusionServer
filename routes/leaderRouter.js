const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();

leaderRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send leaders list");
  })
  .post((req, res, next) => {
    res.end(
      "Will add leader: " + req.body.name + " with detail: " + req.body.detail
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete((req, res, next) => {
    res.end("Deleteing all leaders!");
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    res.end(
      "Will send you details about leader: " + req.params.leaderId + " to you"
    );
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  })
  .put((req, res, next) => {
    res.write("Updating the leader: " + req.params.leaderId + "\n");
    res.end("Updated details about leader: " + req.params.leaderId);
  })
  .delete((req, res, next) => {
    res.end("Deleteing leader: " + req.params.leaderId);
  });

module.exports = leaderRouter;
