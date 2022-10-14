const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router({ mergeParams: true });

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.end("Will send dishes list");
  })
  .post((req, res, next) => {
    res.end(
      "Will add dish: " + req.body.name + " with detail: " + req.body.detail
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    res.end("Deleteing all dishes!");
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    res.end(
      "Will send you details about dish: " + req.params.dishId + " to you"
    );
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put((req, res, next) => {
    res.write("Updating the dish: " + req.params.dishId + "\n");
    res.end("Updated details about dish: " + req.params.dishId);
  })
  .delete((req, res, next) => {
    res.end("Deleteing dish: " + req.params.dishId);
  });

module.exports = dishRouter;
