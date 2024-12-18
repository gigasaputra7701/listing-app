const express = require("express");
const router = express.Router();

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
router.get("/:id", getDetailsPlace);
router.get("/:id/edit", getEdit);
router.put("/:id", putEdit);
router.delete("/:id", deletePlace);

// Restful Review
router.post("/:id/reviews", postReview);
router.delete("/:id/reviews/:review_id", deleteReview);

// 404 Handler
router.all("*", pageNotFound);

module.exports = router;
