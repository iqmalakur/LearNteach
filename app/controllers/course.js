const Course = require("../models/Course");

module.exports = {
  /**
   * Render list of classes page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const courses = await Course.getAll();

    res.render("course/index", {
      layout: "layouts/main-layout",
      title: "Course List",
      courses,
    });
  },

  /**
   * Render class info page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  detail: async (req, res) => {
    const course = await Course.get(req.params.courseId);

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
    const course = await Course.get(req.params.courseId);
    const instructor = await course.getInstructor();

    res.render("course/instructor", {
      layout: "layouts/main-layout",
      title: "Instructor Info",
      instructor,
    });
  },
};
