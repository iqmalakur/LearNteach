const { User, Instructor, Course } = require("../models/Database");
const { priceFormat } = require("../utils/format");

module.exports = {
  /**
   * Render list of classes page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const user = res.locals.user;

    const courses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    res.render("course/index", {
      layout: "layouts/main-layout",
      title: "Course List",
      user,
      courses,
      priceFormat,
    });
  },

  /**
   * Render class info page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  detail: async (req, res) => {
    const course = await Course.findByPk(req.params.courseId);
    const user = res.locals.user;

    res.render("course/detail", {
      layout: "layouts/main-layout",
      title: "Course Detail",
      course,
      user,
    });
  },

  /**
   * Render instructor info page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  instructor: async (req, res) => {
    const course = await Course.findByPk(req.params.courseId);
    const instructor = await Instructor.findByPk(course.instructor);
    const user = res.locals.user;

    res.render("course/instructor", {
      layout: "layouts/main-layout",
      title: "Instructor Info",
      instructor,
      user,
    });
  },
};
