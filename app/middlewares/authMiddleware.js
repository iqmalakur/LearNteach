const { Instructor } = require("../models/Database");
const { verifyToken } = require("../utils/jwt");

module.exports = {
  /**
   * Validate Login Token
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   * @param {NextFunction} next The NextFunction function.
   * @return {ServerResponse}
   */
  checkToken: async (req, res, next) => {
    const token = req.cookies.token;
    let auth = false;
    let public = false;

    res.locals.user = null;

    // Check if the url destination is auth pages
    switch (req.originalUrl) {
      case "/login":
      case "/register":
      case "/recovery":
        auth = true;
    }

    // Check if the url destination is public pages
    switch (req.originalUrl) {
      case "/":
      case "/faq":
      case "/course":
        public = true;
    }

    // Check if there is no cookie named token
    if (!token) {
      return auth || public ? next() : res.redirect("/login");
    }

    // If token is valid
    let user = null;
    if ((user = await verifyToken(token))) {
      // Redirect to landing page if the url destination is auth pages
      if (auth) {
        return res.redirect("/");
      }

      const instructor = await Instructor.findOne({
        where: { username: user.username },
        attributes: ["username", "bio"],
      });

      user.isInstructor = instructor ? true : false;
      user.bio = instructor ? instructor.bio : null;
      res.locals.user = user;

      return next();
    }

    // Redirect to login page if token is invalid
    res.clearCookie("token");
    return res.redirect("/login");
  },

  /**
   * Validate Instructor User
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   * @param {NextFunction} next The NextFunction function.
   * @return {ServerResponse}
   */
  checkInstructor: async (req, res, next) => {
    const token = req.cookies.token;
    let auth = false;

    res.locals.user = null;

    // Check if the url destination is auth pages
    if (req.originalUrl === "/instructor/register") {
      auth = true;
    }

    // Check if there is no cookie named token
    if (!token) {
      return res.redirect("/login");
    }

    // If token is valid
    let user = null;
    if ((user = await verifyToken(token))) {
      const instructor = await Instructor.findByPk(user.username);

      if (auth && instructor) {
        return res.redirect("/instructor");
      }

      if (!auth && !instructor) {
        return res.redirect("/instructor/register");
      }

      if (!auth && instructor) {
        user.Instructor = instructor;
        user.isInstructor = true;
      }

      res.locals.user = user;

      return next();
    }

    // Redirect to login page if token is invalid
    res.clearCookie("token");
    return res.redirect("/login");
  },
};
