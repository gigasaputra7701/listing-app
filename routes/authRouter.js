const express = require("express");
const router = express.Router();
const isValidObjectId = require("../middleware/isValidObjectId");

const {
  getPlaces,
  postPlaces,
  getCreate,
  getDetailsPlace,
  getEdit,
  putEdit,
  deletePlace,
  pageNotFound,
} = require("../controller/authController.js");

const { postReview, deleteReview } = require("../controller/review.js");

router.get("/", getPlaces).post("/", postPlaces);

router.get("/create", getCreate);
router
  .route("/:id")
  .get(isValidObjectId("/places"), getDetailsPlace)
  .put(isValidObjectId("/places"), putEdit)
  .delete(isValidObjectId("/places"), deletePlace);

router.get("/:id/edit", isValidObjectId("/places"), getEdit);

// Restful Review
router.post("/:id/reviews", isValidObjectId("/places"), postReview);
router.delete(
  "/:id/reviews/:review_id",
  isValidObjectId("/places"),
  deleteReview
);

// 404 Handler
router.all("*", pageNotFound);

module.exports = router;
