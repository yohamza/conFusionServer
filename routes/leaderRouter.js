const express = require("express");
const bodyParser = require("body-parser");
const Leaders = require("../models/leaders");
const leaderModel = require("../models/leaders");

const leaderRouter = express.Router();

leaderRouter
  .route("/")
  .get((req, res, next) => {
    Leaders.find({})
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then(
        (leader) => {
          if (leader != null) {
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          } else {
            err = new Error("Leader " + req.params.leaderId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete((req, res, next) => {
    Leaders.deleteMany({})
      .then(
        () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json("All leaders deleted succesfully");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          if (leader != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          } else {
            err = new Error("Leader " + req.params.leaderId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  })
  .put((req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (leader) => {
          if (leader != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          } else {
            err = new Error("Leader " + req.params.leaderId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
      .then(
        (leader) => {
          if (leader != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json("Leader " + req.params.leaderId + " deleted succesfully");
          } else {
            err = new Error("Leader " + req.params.leaderId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
