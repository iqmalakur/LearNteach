const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Validate JWT token
   *
   * @param {String} token Token to be validated.
   * @return {Boolean}
   */
  isTokenValid: (token) => {
    try {
      jwt.verify(token, "LearNteach-Sekodlah23");
      return true;
    } catch (err) {
      res.clearCookie("token");
      return false;
    }
  },
};
