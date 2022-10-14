const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send promotions list");
  })
  .post((req, res, next) => {
    res.end(
      "Will add promotion: " +
        req.body.name +
        " with detail: " +
        req.body.detail
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    res.end("Deleteing all promotions!");
  });

promoRouter
  .route("/:promoId")
  .get((req, res, next) => {
    res.end(
      "Will send you details about promotion: " + req.params.promoId + " to you"
    );
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /promotions/" + req.params.promoId
    );
  })
  .put((req, res, next) => {
    res.write("Updating the promotion: " + req.params.promoId + "\n");
    res.end("Updated details about promotion: " + req.params.promoId);
  })
  .delete((req, res, next) => {
    res.end("Deleteing promotion: " + req.params.promoId);
  });

module.exports = promoRouter;
