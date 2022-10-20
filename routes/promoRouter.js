const express = require("express");
const bodyParser = require("body-parser");
const Promotions = require("../models/promotions");

const promoRouter = express.Router();

promoRouter
  .route("/")
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promotion) => {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    Promotions.deleteMany({})
      .then(
        () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json("All promotions have been deleted succesfully");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promotion) => {
          if (promotion != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promotion);
          } else {
            err = new Error("Promotion " + req.params.promoId + " not found");
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
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put((req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promoId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (promotion) => {
          if (promotion != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promotion);
          } else {
            err = new Error("Promotion " + req.params.promoId + " not found");
            err.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Promotions.findByIdAndDelete(
      req.params.promoId
        .then(
          (promotion) => {
            if (promotion != null) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(
                "Promotion " + req.params.promoId + " deleted succesfully"
              );
            } else {
              err = new Error("Promotion " + req.params.promoId + " not found");
              err.statusCode = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err))
    );
  });

module.exports = promoRouter;
