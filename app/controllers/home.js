const Course = require("../models/Course");

module.exports = {
  /**
   * Render landing page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const courses = await Course.getAll();

    res.render("index", {
      layout: "layouts/index-layout",
      title: "LearNteach",
      courses,
    });
  },

  /**
   * Render faq page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  faq: (req, res) => {
    res.render("faq", {
      layout: "layouts/raw-layout",
      title: "Frequently Asked Question",
    });
  },
};
