const { User, Course } = require("../models/Database");
const { priceFormat } = require("../utils/format");

module.exports = {
  /**
   * Render landing page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const lastCourses = await Course.findAll({
      attributes: ["id", "title", "description", "preview"],
      order: [["updatedAt", "DESC"]],
      limit: 3,
    });
    const courses = await Course.findAll({
      attributes: ["id", "title", "price", "rating", "preview"],
      order: [["rating", "DESC"]],
      limit: 4,
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    const successMessage = req.cookies.successMessage ?? false;
    const user = res.locals.user;

    if (successMessage) {
      res.clearCookie("successMessage");
    }

    res.render("index", {
      layout: "layouts/index-layout",
      title: "LearNteach",
      user,
      lastCourses,
      courses,
      priceFormat,
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
