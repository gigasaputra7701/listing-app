//Models
const Place = require("../models/place");

//Utils
const wrapAsync = require("../utils/wrapAsync");
const formatRupiah = require("../utils/formatRupiah");
const calculateAverageRating = require("../utils/totalRating");
const formatUsername = require("../utils/formatUsername");
const ErrorHandler = require("../utils/ErrorHandler");

//Schemas
const { placeSchema } = require("../schemas/place");

// Middleware
const { isAuthorPlace } = require("../middleware/isAuthor");
const isAuth = require("../middleware/isAuth");

// Validate
const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

//Restful
const getPlaces = wrapAsync(async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

const postPlaces = [
  isAuth,
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place({
      ...req.body.place,
      author: req.user._id,
    });
    await place.save();
    req.flash("success_msg", "Place added successfully");
    res.redirect(`/places/${place._id}`);
  }),
];

const getCreate = [
  isAuth,
  (req, res) => {
    res.render("places/create");
  },
];

const getDetailsPlace = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const place = await Place.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  res.render("places/details", {
    place,
    formatRupiah,
    calculateAverageRating,
    formatUsername,
  });
});

const getEdit = [
  isAuth,
  isAuthorPlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/edit", { place });
  }),
];

const putEdit = [
  isAuth,
  isAuthorPlace,
  validatePlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { ...req.body.place });
    req.flash("success_msg", "Place edited successfully");
    res.redirect(`/places/${id}`);
  }),
];

const deletePlace = [
  isAuth,
  isAuthorPlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash("success_msg", "Place deleted successfully");
    res.redirect("/places/");
  }),
];

const pageNotFound = (req, res, next) => {
  next(new ErrorHandler("Page not found", 404));
};

module.exports = {
  getPlaces,
  postPlaces,
  getCreate,
  getDetailsPlace,
  getEdit,
  putEdit,
  deletePlace,
  pageNotFound,
};
