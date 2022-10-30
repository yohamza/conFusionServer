const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const passport = require('passport');
const { populate } = require('../models/favorite');
const cors = require('./cors');

const favoriteRouter = express.Router({ mergeParams: true });

favoriteRouter.use(bodyParser.json());
favoriteRouter.use(authenticate.verifyUser);

favoriteRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, async (req, res, next) => {
        try {
            //Find all favorites and populate nested author field by chaining populate methods
            let favorites = await Favorite.find({})
                .populate('user')
                .populate({
                    path: 'dishes',
                    model: 'Dish',
                    populate: {
                        path: 'comments.author',
                        model: 'User'
                    }
                });

            if (favorites) {
                user_favorites = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if (!user_favorites) {
                    var err = new Error('You have no favourites!');
                    err.status = 404;
                    return next(err);
                }
                res.statusCode = 200;
                // res.setHeader("Content-Type", "application/json");
                res.json(user_favorites);

            } else {
                var err = new Error('There are no favourites');
                err.status = 404;
                return next(err);
            }
        } catch (error) {
            next(error);
        }
    })
    .post(cors.corsWithOptions, async (req, res, next) => {
        try {
            if (!req.body) {
                err = new Error('Body can\'t be empty!');
                err.status = 401;
                return next(err);
            }

            console.log(req.user._id);

            let favorite = await Favorite.findOne({ user: req.user._id });
            if (favorite != null) {

                /**This variable is to check if there were any actual change. 
                If there's no change than no need to query database**/
                let changeInFavorites = 0

                for (let i = 0; i < req.body.length; i++) {
                    if (favorite.dishes.indexOf(req.body[i]) == -1) {
                        favorite.dishes.push(req.body[i]);
                        changeInFavorites++;
                    }
                }

                if (changeInFavorites > 0) {
                    let saveFavorite = await favorite.save();
                    res.status(201).json(saveFavorite);
                }
                else {
                    err = new Error('Items already in favorites');
                    err.status = 409;
                    return next(err);
                }

            }
            else {
                let createFavorite = await Favorite.create({ user: req.user._id, dishes: req.body });
                res.status(201).json(createFavorite);
            }

        } catch (error) {
            next(error);
        }
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.status(403).send('PUT operation is not allowed on /favorites')
    })
    .delete(cors.corsWithOptions, async (req, res, next) => {
        try {

            let deleteResult = await Favorite.deleteMany({});
            res.status(200).send({ message: 'Favorites deleted succesfully', response: deleteResult });

        } catch (error) {
            next(error);
        }
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, async (req, res, next) => {
        try {
            if (!req.body) {
                err = new Error('Body can\'t be empty!');
                err.status = 401;
                return next(err);
            }

            let favorite = await Favorite.findOne({ user: req.user._id });
            if (favorite != null) {

                //Same logic as post for /favorites endpoint
                let changeInFavorites = 0

                for (let i = 0; i < req.body.length; i++) {
                    if (favorite.dishes.indexOf(req.body) == -1) {
                        favorite.dishes.push(req.body);
                        changeInFavorites++;
                    }
                }

                if (changeInFavorites > 0) {
                    let saveFavorite = await favorite.save();
                    res.status(201).json(saveFavorite);
                }
                else {
                    err = new Error('Items already in favorites');
                    err.status = 409;
                    return next(err);
                }

            }
            else {
                let createFavorite = await Favorite.create({ user: req.user._id, dishes: req.body });
                res.status(201).json(createFavorite);
            }

        } catch (error) {
            next(error);
        }
    })
    .delete(cors.corsWithOptions, async (req, res, next) => {
        try {

            let favorite = await Favorite.findOne({ user: req.user._id });
            if (favorite == null) {
                res.status(200).send('No Favorites found for you');
            }
            else {

                for (let i = 0; i < favorite.dishes.length; i++) {
                    if (favorite.dishes.indexOf(req.params.dishId) !== -1) {
                        favorite.dishes.pop(req.params.dishId._id);
                    }
                }

                /**if after deleting a favorite dish the list is not empty than we'll save changes to db.
                 Otherwise when the list becomse empty after the delete operation.
                 This means that this was the last item and the whole object should be deleted**/

                if (favorite.dishes.length > 0) {
                    let saveFavorite = await favorite.save();
                    res.status(200).json({ message: 'Favorite dish deleted', response: saveFavorite });
                }
                else {
                    let deleteAllFavorites = await Favorite.deleteMany({});
                    res.status(200).json({ message: 'Favorites deleted succesfully', response: deleteAllFavorites });
                }
            }

        } catch (error) {
            next(error);
        }
    });


module.exports = favoriteRouter;