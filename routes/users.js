const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");

router.use(bodyParser.json());

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res, next) => {
  try {
    console.log(
      "username: " + req.body.username + "\npassword: " + req.body.password
    );
    let user = await User.findOne({ username: req.body.username });
    if (user != null) {
      var error = new Error("User" + req.body.username + " already exists");
      error.status = 403;
      next(error);
    } else {
      if (req.body.username.length < 3) {
        var error = new Error("Name can't be less than 3 characters");
        error.status = 403;
        next(error);
        return;
      } else if (req.body.password.length < 5) {
        var error = new Error("Password's length can't be less than 5");
        error.status = 403;
        next(error);
        return;
      }

      User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (error, user) => {
          if (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ error: error });
          } else {
            passport.authenticate("local")(req, res, () => {
              res.status = 201;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, message: "User created succesfully" });
            });
          }
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, message: "Logged In succesfully" });
});

router.get("/logout", async (req, res, next) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user != null) {
      if (req.session) {
        req.session.destroy;
        res.clearCookie("session-id");
        res.redirect("/");
      } else {
        var error = new Error("User " + req.body.username + " doesn't exist.");
        error.statusCode = 401;
        next(error);
      }
    } else {
      var error = new Error("User " + req.body.username + " doesn't exist.");
      error.statusCode = 401;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
