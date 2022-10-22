var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");

const mongoose = require("mongoose");
const Dishes = require("./models/dishes");

const dbUrl = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(dbUrl);

connect.then(
  (db) => {
    console.log("Connected correctly to conFusion");
  },
  (err) => {
    console.log(err);
  }
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

function auth(req, res, next) {

  console.log(req.signedCookies);

  if (!req.signedCookies.user) {

    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var error = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      error.statusCode = 401;
      next(error);
      return;
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    var username = auth[0];
    var password = auth[1];

    if (username === 'hamza' && password === 'password') {
      res.cookie('user', 'hamza', { signed: true });
      next();
    }
    else {
      var error = new Error('Wrong username or password');
      res.setHeader('WWW-Authenticate', 'Basic');
      error.statusCode = 401;
      next(error);
    }

  }
  else {
    if (req.signedCookies.user === 'hamza') {
      next();
    }
    else {
      var error = new Error('Wrong username or password');
      error.statusCode = 401;
      next(error);
    }
  }

}

app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/dishes", dishRouter);
app.use("/leaders", leaderRouter);
app.use("/promotions", promoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
