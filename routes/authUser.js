const express = require("express");
const router = express.Router();
const {
  getIndex,
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
} = require("../controller/user.js");

router.route("/").get(getIndex);
router.route("/register").get(getRegister).post(postRegister);
router.route("/login").get(getLogin).post(postLogin);
router.post("/logout", logout);

module.exports = router;
