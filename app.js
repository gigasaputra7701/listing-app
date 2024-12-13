const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
// Models
const Place = require("./models/place");

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

app.get("/", (req, res) => {
  res.render("home");
});

//Route Page Places
app.get("/places", async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

//Route Page Create
app.get("/places/create", (req, res) => {
  res.render("places/create");
});

//Restful Create Data
app.post("/places", async (req, res) => {
  const place = new Place(req.body.place);
  await place.save();
  res.redirect(`/places/${place._id}`);
});

//Read Data
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/details", { place });
});

//Route Page Edit
app.get("/places/:id/edit", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/edit", { place });
});

//Restful Edit Data
app.put("/places/:id", async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndUpdate(id, { ...req.body.place });
  res.redirect(`/places/${id}`);
});

//Restful Delete Data
app.delete("/places/:id", async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  res.redirect("/places/");
});

app.listen(3000, () => {
  console.log(`server is running on http://127.0.0.1:3000`);
});
