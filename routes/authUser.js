const express = require("express");
const router = express.Router();
const checkPasswordsMatch = require("../middleware/checkPasswordsMatch.js");

const {
  getRegister,
  postRegister,
} = require("../controller/authController.js");

router.get("/register", getRegister);
router.post("/register", checkPasswordsMatch, postRegister);

module.exports = router;
