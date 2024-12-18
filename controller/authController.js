const Place = require("../models/place");
const Review = require("../models/review");

const wrapAsync = require("../utils/wrapAsync");
const formatRupiah = require("../utils/formatRupiah");
const calculateAverageRating = require("../utils/totalRating");
const ErrorHandler = require("../utils/ErrorHandler");

//Schemas
const { placeSchema } = require("../schemas/place");
const { reviewSchema } = require("../schemas/review");

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
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

const home = (req, res) => {
  res.render("home");
};

const getPlaces = wrapAsync(async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

const postPlaces = [
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect(`/places/${place._id}`);
  }),
];

const getCreate = (req, res) => {
  res.render("places/create");
};

const getDetailsPlace = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id).populate("reviews");
  res.render("places/details", { place, formatRupiah, calculateAverageRating });
});

const getEdit = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/edit", { place });
});

const putEdit = [
  validatePlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { ...req.body.place });
    res.redirect(`/places/${id}`);
  }),
];

const deletePlace = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  res.redirect("/places/");
});

const postReview = [
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const review = new Review(req.body.review);
    const place = await Place.findById(id);
    place.reviews.push(review);
    await review.save();
    await place.save();

    res.redirect(`/places/${id}`);
  }),
];

const deleteReview = wrapAsync(async (req, res) => {
  console.log("delete review");
});

const pageNotFound = (req, res, next) => {
  next(new ErrorHandler("Page not found", 404));
};



// Export the functions
module.exports = {
  home,
  getPlaces,
  postPlaces,
  getCreate,
  getDetailsPlace,
  getEdit,
  putEdit,
  deletePlace,
  postReview,
  deleteReview,
  pageNotFound,
};
