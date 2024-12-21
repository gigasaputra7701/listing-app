// Middleware for checking if password and password2 are the same
const checkPasswordsMatch = (req, res, next) => {
  const { password, password2 } = req.body;



  next(); // Continue to the next middleware or route handler
};

module.exports = checkPasswordsMatch;
