const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
// Models
const Place = require("./models/place");

mongoose
  .connect("mongodb://localhost:27017/bestpoints")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/places", async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

app.post("/places", async (req, res) => {
  const place = new Place(req.body);
  await place.save();
  res.redirect(`/places/${place._id}`);
});

app.get("/places/create", (req, res) => {
  res.render("places/create");
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/details", { place });
});

app.delete("/places/:id", async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  res.redirect("/places/");
});
// app.get("/seed/place", async (req, res) => {
//   const place = new Place({
//     title: "Empire State Building",
//     price: "$999999",
//     description: "A Great building",
//     location: "New York, NY",
//   });
//   await place.save();
//   res.send(place);
// });

app.listen(3000, () => {
  console.log(`server is running on http://127.0.0.1:3000`);
});
