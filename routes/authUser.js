const express = require("express");
const router = express.Router();
const checkPasswordsMatch = require("../middleware/checkPasswordsMatch.js");

const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
} = require("../controller/authController.js");

router.get("/register", getRegister);
router.post("/register", checkPasswordsMatch, postRegister);
router.get("/login", getLogin);
router.post("/login", postLogin);
router.post("/logout", logout);

module.exports = router;
