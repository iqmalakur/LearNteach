const jwt = require("jsonwebtoken");

/**
 * Authentication Service.
 *
 * @class AuthService
 */
class AuthService {
  /**
   * Validate JWT token
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   * @param {NextFunction} next The NextFunction function.
   * @return {ServerResponse}
   */
  checkToken(req, res, next) {
    const token = req.cookies.token;
    let auth = false;

    // Check if the url destination is auth pages
    switch (req.originalUrl) {
      case "/login":
      case "/register":
      case "/recovery":
        auth = true;
    }

    // Check if there is no cookie named token
    if (!token) {
      return auth ? next() : res.redirect("/login");
    }

    // Validate the token
    try {
      jwt.verify(token, "LearNteach-Sekodlah23");

      // Redirect to landing page if the url destination is auth pages
      if (auth) {
        return res.redirect("/");
      }

      return next();
    } catch (err) {
      res.clearCookie("token");
      return res.redirect("/login");
    }
  }
}

module.exports = AuthService;
