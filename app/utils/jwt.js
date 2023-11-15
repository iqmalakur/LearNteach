const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Validate JWT token
   *
   * @param {String} token Token to be validated.
   * @return {Object} Value of token
   */
  verifyToken: (token) => {
    try {
      return jwt.verify(token, "LearNteach-Sekodlah23");
    } catch (err) {
      res.clearCookie("token");
      return null;
    }
  },
};
