const { User, Instructor, Course } = require("../models/Database");
const { priceFormat } = require("../utils/format");
const { verifyToken } = require("../utils/jwt");

module.exports = {
  /**
   * Render list of classes page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const token = req.cookies.token;
    const username = (await verifyToken(token))?.username;

    const user = await User.findByPk(username);

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

    res.render("course/detail", {
      layout: "layouts/main-layout",
      title: "Course Detail",
      course,
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

    res.render("course/instructor", {
      layout: "layouts/main-layout",
      title: "Instructor Info",
      instructor,
    });
  },
};
