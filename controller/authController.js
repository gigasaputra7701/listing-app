//Models
const Place = require("../models/place");
const Review = require("../models/review");
const User = require("../models/user");
const passport = require("passport");
//Utils
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

//Restful
const getPlaces = wrapAsync(async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

const postPlaces = [
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash("success_msg", "Place added successfully");
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
    req.flash("success_msg", "Place edited successfully");
    res.redirect(`/places/${id}`);
  }),
];

const deletePlace = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  req.flash("success_msg", "Place deleted successfully");
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

    req.flash("success_msg", "Review added successfully");
    res.redirect(`/places/${id}`);
  }),
];

const deleteReview = wrapAsync(async (req, res) => {
  const { id, review_id } = req.params;
  await Place.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
  await Review.findByIdAndDelete(review_id);
  req.flash("success_msg", "Review deleted successfully");
  res.redirect(`/places/${id}`);
});

const getRegister = (req, res) => {
  res.render("auth/register");
};

const postRegister = wrapAsync(async (req, res) => {
  try {
    const { email, username, password, password2 } = req.body.user;

    if (password !== password2) {
      req.flash("error_msg", "Passwords do not match");
      return res.redirect("/register");
    }
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success_msg", "You are registered and logged in");
      res.redirect("/places");
    });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect(`/register`);
  }
});

const getLogin = (req, res) => {
  res.render("auth/login");
};

const postLogin = [
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
      type: "error_msg",
      msg: "Invalid username or password",
    },
  }),
  (req, res) => {
    req.flash("success_msg", "You are logged in");
    res.redirect("/places");
  },
];

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
};

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
  postReview,
  deleteReview,
  getRegister,
  postRegister,
  pageNotFound,
  getLogin,
  postLogin,
  logout,
};
