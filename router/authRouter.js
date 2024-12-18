const express = require("express");
const router = express.Router();

const {
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
} = require("../controller/authController.js");

router.get("/", home);
router.get("/places", getPlaces);
router.post("/places", postPlaces);

router.get("/places/create", getCreate);
router.get("/places/:id", getDetailsPlace);
router.get("/places/:id/edit", getEdit);
router.put("/places/:id", putEdit);
router.delete("/places/:id", deletePlace);

// Restful Review
router.post("/places/:id/reviews", postReview);
router.delete("/places/:id/reviews/:review_id", deleteReview);

// 404 Handler
router.all("*", pageNotFound);

module.exports = router;
