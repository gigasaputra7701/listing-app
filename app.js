const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");

const authRouter = require("./routes/authRouter");
const authUser = require("./routes/authUser");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const app = express();

//config mongodb
mongoose
  .connect("mongodb://localhost:27017/bestpoints")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //setter
passport.deserializeUser(User.deserializeUser()); //getter

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

//Routes
app.use("/places", authRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/", authUser);

// Error Handler
const error = (err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
};
app.use(error);

app.listen(3000, () => {
  console.log(`server is running on http://127.0.0.1:3000`);
});
