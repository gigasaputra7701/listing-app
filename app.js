const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync");
const ErrorHandler = require("./utils/ErrorHandler");
const path = require("path");
const app = express();
const methodOverride = require("method-override");

//Models
const Place = require("./models/place");

//Schemas
const { placeSchema } = require("./schemas/place");

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

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(error, 400));
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

//Route Page Places
app.get(
  "/places",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render("places/index", { places });
  })
);

//Route Page Create
app.get("/places/create", (req, res) => {
  res.render("places/create");
});

//Restful Create Data
app.post(
  "/places",
  validatePlace,
  wrapAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect(`/places/${place._id}`);
  })
);

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
app.put(
  "/places/:id",
  validatePlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { ...req.body.place });
    res.redirect(`/places/${id}`);
  })
);

//Restful Delete Data
app.delete(
  "/places/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect("/places/");
  })
);

app.all("*", (req, res, next) => {
  next(new ErrorHandler("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`server is running on http://127.0.0.1:3000`);
});
