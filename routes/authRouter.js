const express = require("express");
const router = express.Router();
const isValidObjectId = require("../middleware/isValidObjectId");
const isAuth = require("../middleware/isAuth.js");

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

router.get("/", getPlaces);
router.post("/", isAuth, postPlaces);

router.get("/create", isAuth, getCreate);
router.get("/:id", isValidObjectId("/places"), getDetailsPlace);
router.get("/:id/edit", isAuth, isValidObjectId("/places"), getEdit);
router.put("/:id", isAuth, isValidObjectId("/places"), putEdit);
router.delete("/:id", isAuth, isValidObjectId("/places"), deletePlace);

// Restful Review
router.post("/:id/reviews", isAuth, isValidObjectId("/places"), postReview);
router.delete(
  "/:id/reviews/:review_id",
  isAuth,
  isValidObjectId("/places"),
  deleteReview
);

// 404 Handler
router.all("*", pageNotFound);

module.exports = router;
