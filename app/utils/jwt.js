const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  /**
   * Validate JWT token
   *
   * @param {String} token Token to be validated.
   * @return {Object} Value of token
   */
  verifyToken: async (token) => {
    try {
      const user = jwt.verify(token, "LearNteach-Sekodlah23");

      if (await User.get(user.username)) {
        return user;
      }

      throw new Error();
    } catch (err) {
      return null;
    }
  },
};
