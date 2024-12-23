const User = require("../models/user");
const passport = require("passport");
//Utils
const wrapAsync = require("../utils/wrapAsync");

const getRegister = (req, res) => {
  const auth = req.isAuthenticated();
  if (!auth) {
    res.render("auth/register");
  } else {
    req.flash("error_msg", "You are login,<br>Logout first!");
    res.redirect("/");
  }
};

const postRegister = wrapAsync(async (req, res) => {
  try {
    const { email, username, password, password2 } = req.body.user;

    if (password !== password2) {
      req.flash("error_msg", "Passwords do not match");
      return res.redirect("/register");
    }
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success_msg", "You are registered and logged in");
      res.redirect("/places");
    });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.redirect(`/register`);
  }
});

const getLogin = (req, res) => {
  const auth = req.isAuthenticated();
  if (!auth) {
    res.render("auth/login");
  } else {
    req.flash("error_msg", "You are login,<br>Logout first!");
    res.redirect("/");
  }
};

const postLogin = [
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
      type: "error_msg",
      msg: "Invalid username or password",
    },
  }),
  (req, res) => {
    req.flash("success_msg", "You are logged in");
    res.redirect("/places");
  },
];

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
};

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
};
