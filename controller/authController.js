//Models
const Place = require("../models/place");
const fs = require("fs");
//Utils
const wrapAsync = require("../utils/wrapAsync");
const formatRupiah = require("../utils/formatRupiah");
const calculateAverageRating = require("../utils/totalRating");
const formatUsername = require("../utils/formatUsername");
const { geometry } = require("../utils/hereMaps");
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

    const geoData = await geometry(req.body.place.location);

    const place = new Place({
      ...req.body.place,
      images: images,
      geometry: geoData,
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
    const geoData = await geometry(req.body.place.location);
    const place = await Place.findByIdAndUpdate(id, {
      ...req.body.place,
      geometry: geoData,
    });

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

const deleteImage = [
  isValidObjectId("/places"),
  isAuth,
  isAuthorPlace,
  wrapAsync(async (req, res) => {
    try {
      const { id } = req.params;
      const { images } = req.body;

      if (!images || images.length === 0) {
        req.flash(
          "error_msg",
          "Please select at least one image <br> to delete"
        );
        return res.redirect(`/places/${id}/edit`);
      }

      images.forEach((image) => {
        fs.unlinkSync(image);
      });

      await Place.findByIdAndUpdate(id, {
        $pull: { images: { url: { $in: images } } },
      });
      req.flash("success_msg", "Successfully deleted images");
      return res.redirect(`/places/${id}`);
    } catch (error) {
      req.flash("error_msg", "Failed deleted images");
      return res.redirect(`/places/${id}/edit`);
    }
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
  deleteImage,
  pageNotFound,
};
