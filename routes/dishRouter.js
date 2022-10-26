const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const passport = require('passport');

const dishRouter = express.Router({ mergeParams: true });

dishRouter.use(bodyParser.json());

dishRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      let dishes = await Dishes.find({}).populate('comments.author');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    } catch (error) {
      next(error);
    }
  })
  .post(authenticate.verifyUser, async (req, res, next) => {
    try {
      let dish = await Dishes.create(req.body);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
    } catch (error) {
      next(error);
    }
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
  })
  .delete(authenticate.verifyUser, async (req, res, next) => {
    try {
      let result = await Dishes.deleteMany({});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end('Dishes deleted succesfully');
    } catch (error) {
      next(error);
    }
  });

dishRouter
  .route('/:dishId')
  .get(async (req, res, next) => {
    try {
      let dish = Dishes.findById(req.params.dishId).populate('comments.author');
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      } else {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
  })
  .put(authenticate.verifyUser, async (req, res, next) => {
    try {
      let dish = await Dishes.findByIdAndUpdate(
        req.params.dishId,
        { $set: req.body },
        { new: true }
      );
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      } else {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })

  .delete(authenticate.verifyUser, async (req, res, next) => {
    try {
      let dish = await Dishes.findByIdAndDelete(req.params.dishId);
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      } else {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  });

dishRouter
  .route('/:dishId/comments')
  .get(async (req, res, next) => {
    try {
      let dish = await Dishes.findById(req.params.dishId).populate('comments.author');
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      } else {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .post(authenticate.verifyUser, async (req, res, next) => {
    try {
      let dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        req.body.author = req.user._id;
        dish.comments.push(req.body);

        let dishSave = await dish.save();

        if (dishSave != null) {

          let dish = await Dishes.findById(dishSave._id).populate('comments.author');

          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);

        }

      } else {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'PUT operation not supported on /dishes' + req.params.dishId + '/comments'
    );
  })
  .delete(authenticate.verifyUser, async (req, res, next) => {
    try {
      let dish = await Dishes.findById(req.params.dishId);

      if (dish != null) {
        for (var i = dish.comments.length - 1; i >= 0; i--) {
          dish.comments.id(dish.comments[i]._id).remove();
        }

        let saveResult = await dish.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(saveResult);
      } else {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  });

dishRouter
  .route('/:dishId/comments/:commentId')
  .get(async (req, res, next) => {
    try {
      let dish = await Dishes.findById(req.params.dishId).populate('comments.author');
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments.id(req.params.commentId));
      } else if (dish == null) {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      } else if (dish.comments.length == 0) {
        error = new Error('Comment ' + req.params.commentId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'POST operation not supported on /dishes/' +
      req.params.dishId +
      '/comments/' +
      req.params.commentId
    );
  })
  .put(authenticate.verifyUser, async (req, res, next) => {
    try {
      let dish = await Dishes.findById(req.params.dishId);
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        if (req.body.rating) {
          dish.comments.id(req.params.commentId).rating = req.body.rating;
        }
        if (req.body.comment) {
          dish.comments.id(req.params.commentId).comment = req.body.comment;
        }

        let saveResult = await dish.save();

        if (saveResult != null) {

          let dish = await Dishes.findById(saveResult._id).populate('comments.author');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);

        }

      } else if (dish == null) {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      } else if (dish.comments.length == 0) {
        error = new Error('Comment ' + req.params.commentId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  })
  .delete(authenticate.verifyUser, async (req, res, next) => {
    try {
      let dish = await Dishes.findById(req.params.dishId);

      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        dish.comments.id(req.params.commentId).remove();

        let saveResult = await dish.save();
        if (saveResult != null) {

          let dish = await Dishes.findById(saveResult._id).populate('comments.author');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);

        }
      } else if (dish == null) {
        error = new Error('Dish ' + req.params.dishId + ' not found');
        error.statusCode = 404;
        return next(error);
      } else if (dish.comments.length == 0) {
        error = new Error('Comment ' + req.params.commentId + ' not found');
        error.statusCode = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = dishRouter;
