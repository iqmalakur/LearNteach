const jwt = require("jsonwebtoken");
const { User } = require("../models/Database");

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

      if (await User.findByPk(user.username)) {
        return user;
      }

      throw new Error();
    } catch (err) {
      return null;
    }
  },
};
