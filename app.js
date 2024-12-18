const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");

const authRouter = require("./router/authRouter");

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

app.use(authRouter);

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
