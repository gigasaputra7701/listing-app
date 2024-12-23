//Models
const Place = require("../models/place");
const fs = require("fs");
//Utils
const wrapAsync = require("../utils/wrapAsync");
const formatRupiah = require("../utils/formatRupiah");
const calculateAverageRating = require("../utils/totalRating");
const formatUsername = require("../utils/formatUsername");
const ExpressError = require("../utils/ErrorHandler");

// Middleware
const isValidObjectId = require("../middleware/isValidObjectId");
const { isAuthorPlace } = require("../middleware/isAuthor");
const isAuth = require("../middleware/isAuth");
const { validatePlace } = require("../middleware/validator");

//Restful
const getPlaces = wrapAsync(async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

const postPlaces = [
  isAuth,
  validatePlace,
  wrapAsync(async (req, res) => {
    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    const place = new Place({
      ...req.body.place,
      images: images,
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

const getDetailsPlace = [
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
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
  }),
];

const getEdit = [
  isValidObjectId("/places"),
  isAuth,
  isAuthorPlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/edit", { place });
  }),
];

const putEdit = [
  isValidObjectId("/places"),
  isAuth,
  isAuthorPlace,
  validatePlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, { ...req.body.place });

    if (req.files && req.files.length > 0) {
      place.images.forEach((image) => {
        fs.unlink(image.url, (err) => new ExpressError(err));
      });
      const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
      place.images = images;
      await place.save();
    }
    req.flash("success_msg", "Place edited successfully");
    res.redirect(`/places/${id}`);
  }),
];

const deletePlace = [
  isValidObjectId("/places"),
  isAuth,
  isAuthorPlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (place.images.length > 0) {
      place.images.forEach((image) => {
        fs.unlink(image.url, (err) => new ExpressError(err));
      });
    }
    await place.deleteOne();
    req.flash("success_msg", "Place deleted successfully");
    res.redirect("/places/");
  }),
];

const pageNotFound = (req, res, next) => {
  next(new ExpressError("Page not found", 404));
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
