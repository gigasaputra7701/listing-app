// Models
const Review = require("../models/review");
const Place = require("../models/place");

// Utils
const wrapAsync = require("../utils/wrapAsync");

// Middleware
const { isAuthorReview } = require("../middleware/isAuthor");
const isAuth = require("../middleware/isAuth");
const { validateReview } = require("../middleware/validator");

// Restful
const postReview = [
  isAuth,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const review = new Review({
      ...req.body.review,
      author: req.user._id,
    });

    const place = await Place.findById(id);
    place.reviews.push(review);
    await review.save();
    await place.save();

    req.flash("success_msg", "Review added successfully");
    res.redirect(`/places/${id}`);
  }),
];

const deleteReview = [
  isAuth,
  isAuthorReview,
  wrapAsync(async (req, res) => {
    const { id, review_id } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success_msg", "Review deleted successfully");
    res.redirect(`/places/${id}`);
  }),
];

module.exports = {
  postReview,
  deleteReview,
};
