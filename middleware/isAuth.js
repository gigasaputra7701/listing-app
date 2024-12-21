module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "You are not logged in,<br>Please login first!");
    return res.redirect("/login");
  }
  next();
};
