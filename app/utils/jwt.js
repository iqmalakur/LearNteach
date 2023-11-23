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
      const userToken = jwt.verify(token, "LearNteach-Sekodlah23");

      let user = null;
      if ((user = await User.findByPk(userToken.username))) {
        return user;
      }

      throw new Error();
    } catch (err) {
      return null;
    }
  },
};
