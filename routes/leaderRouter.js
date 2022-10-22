const express = require("express");
const bodyParser = require("body-parser");
const Leaders = require("../models/leaders");

const leaderRouter = express.Router();

leaderRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      let leaders = await Leaders.find({});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(leaders);

    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {

    try {
      let leader = await Leaders.create(req.body);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.json(leader);

    } catch (error) {
      next(error);
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  })
  .delete(async (req, res, next) => {

    try {
      let result = await Leaders.deleteMany({});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json("All leaders deleted succesfully");
    } catch (error) {
      next(error);
    }

  });

leaderRouter
  .route("/:leaderId")
  .get(async (req, res, next) => {

    try {
      let leader = await Leaders.findById(req.params.leaderId);

      if (leader != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      } else {
        error = new Error("Leader " + req.params.leaderId + " not found");
        error.statusCode = 404;
        return next(error);
      }

    } catch (error) {
      next(error);
    }
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  })
  .put(async (req, res, next) => {

    try {
      let leader = await Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true });

      if (leader != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leader);
      } else {
        error = new Error("Leader " + req.params.leaderId + " not found");
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {

    try {
      let result = Leaders.findByIdAndDelete(req.params.leaderId);

      if (result != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json("Leader " + req.params.leaderId + " deleted succesfully");
      } else {
        error = new Error("Leader " + req.params.leaderId + " not found");
        error.statusCode = 404;
        return next(error);
      }

    } catch (error) {
      next(error);
    }
  });

module.exports = leaderRouter;
