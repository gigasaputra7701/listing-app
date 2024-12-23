const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer");
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

router.route("/").get(getPlaces).post(upload.array("image", 5), postPlaces);

router.get("/create", getCreate);

router
  .route("/:id")
  .get(getDetailsPlace)
  .put(upload.array("image", 5), putEdit)
  .delete(deletePlace);

router.get("/:id/edit", getEdit);

// Restful Review
router.post("/:id/reviews", postReview);
router.delete("/:id/reviews/:review_id", deleteReview);

// 404 Handler
router.all("*", pageNotFound);

module.exports = router;
