const Place = require("../models/place");
const Review = require("../models/review");

module.exports.isAuthorPlace = async (req, res, next) => {
  const { id } = req.params;
  let place = await Place.findById(id);

  if (!place.author.equals(req.user._id)) {
    req.flash("error_msg", "Not authorized");
    res.redirect(`/places`);
  }
  next();
};

module.exports.isAuthorReview = async (req, res, next) => {
  const { id, review_id } = req.params;
  let place = await Place.findById(id);
  let review = await Review.findById(review_id);

  if (!review) {
    req.flash("error_msg", "Review not found");
    return res.redirect(`/places`);
  }

  if (!review.author) {
    req.flash("error_msg", "Author not found for this review");
    return res.redirect(`/places`);
  }

  if (
    !review.author.equals(req.user._id) &&
    !place.author.equals(req.user._id)
  ) {
    req.flash("error_msg", "Not authorized");
    return res.redirect(`/places`);
  }

  next();
};
