// Middleware for checking if password and password2 are the same
const checkPasswordsMatch = (req, res, next) => {
  const { password, password2 } = req.body;

  if (password !== password2) {
    req.flash("error_msg", "Passwords do not match. Please try again.");
    return res.redirect("/register"); // Redirect back to the registration page
  }

  next(); // Continue to the next middleware or route handler
};

module.exports = checkPasswordsMatch;
