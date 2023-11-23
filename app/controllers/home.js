const { Course } = require("../models/Database");

module.exports = {
  /**
   * Render landing page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const courses = await Course.findAll();
    const successMessage = req.cookies.successMessage ?? false;
    const user = res.locals.user;

    if (successMessage) {
      res.clearCookie("successMessage");
    }

    res.render("index", {
      layout: "layouts/index-layout",
      title: "LearNteach",
      user,
      courses,
      successMessage,
    });
  },

  /**
   * Render faq page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  faq: (req, res) => {
    const user = res.locals.user;

    res.render("faq", {
      layout: "layouts/raw-layout",
      title: "Frequently Asked Question",
      user,
    });
  },
};
