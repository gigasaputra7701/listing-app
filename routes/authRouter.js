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
  postReview,
  deleteReview,
  pageNotFound,
} = require("../controller/authController.js");

router.get("/", getPlaces);
router.post("/", postPlaces);

router.get("/create", getCreate);
router.get("/:id", isValidObjectId("/places"), getDetailsPlace);
router.get("/:id/edit", isValidObjectId("/places"), getEdit);
router.put("/:id", isValidObjectId("/places"), putEdit);
router.delete("/:id", isValidObjectId("/places"), deletePlace);

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
