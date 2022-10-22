const express = require("express");
const bodyParser = require("body-parser");
const Promotions = require("../models/promotions");

const promoRouter = express.Router();

promoRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      let promotions = await Promotions.find({});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(promotions);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      let promotion = await Promotions.create(req.body);
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.json(promotion);
    } catch (error) {
      next(error);
    }
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete(async (req, res, next) => {
    try {
      let promotions = await Promotions.deleteMany({});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json("All promotions have been deleted succesfully");
    } catch (error) {
      next(error);
    }
  });

promoRouter
  .route("/:promoId")
  .get(async (req, res, next) => {
    try {
      let promotion = await Promotions.findById(req.params.promoId);
      if (promotion != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      } else {
        error = new Error("Promotion " + req.params.promoId + " not found");
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put(async (req, res, next) => {
    try {
      let promotion = await Promotions.findByIdAndUpdate(
        req.params.promoId,
        { $set: req.body },
        { new: true }
      );

      if (promotion != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      } else {
        error = new Error("Promotion " + req.params.promoId + " not found");
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      let promotion = await Promotions.findByIdAndDelete(req.params.promoId);
      if (promotion != null) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json("Promotion " + req.params.promoId + " deleted succesfully");
      } else {
        error = new Error("Promotion " + req.params.promoId + " not found");
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = promoRouter;
