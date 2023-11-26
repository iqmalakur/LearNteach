const sequelize = require("sequelize");
const {
  User,
  Instructor,
  Course,
  EnrolledCourse,
} = require("../models/Database");
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
    const user = res.locals.user;
    const course = await Course.findOne({
      where: { id: req.params.courseId },
      include: [
        {
          model: User,
          attributes: ["name", "picture"],
          include: [
            {
              model: Instructor,
              attributes: ["rating"],
            },
          ],
        },
      ],
    });

    const enrolledCourse = await EnrolledCourse.findOne({
      where: { user: user.username, course: course.id },
      attributes: ["id"],
    });

    const instructorCourses = await Course.findAll({
      where: {
        instructor: course.instructor,
        id: { [sequelize.Op.ne]: course.id },
      },
      limit: 3,
    });

    const instructorCourseTotal = await Course.findOne({
      where: { instructor: course.instructor },
      attributes: [[sequelize.fn("COUNT", sequelize.col("*")), "total_course"]],
    });

    const instructorStudentTotal = await Course.findOne({
      where: { instructor: course.instructor },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("members")), "total_student"],
      ],
    });

    res.render("course/detail", {
      layout: "layouts/main-layout",
      title: "Course Detail",
      course,
      priceFormat,
      user,
      enrolled: enrolledCourse ? true : false,
      instructorCourses,
      totalCourse: instructorCourseTotal.dataValues.total_course,
      totalStudent: instructorStudentTotal.dataValues.total_student,
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
    const user = res.locals.user;

    const instructor = await User.findOne({
      where: { username: course.instructor },
      include: [
        {
          model: Instructor,
          attributes: ["rating", "bio"],
        },
      ],
    });

    const courses = await Course.findAll({
      where: { instructor: course.instructor },
    });

    const totalStudent = await Course.findOne({
      where: { instructor: course.instructor },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("members")), "total_student"],
      ],
    });

    res.render("course/instructor", {
      layout: "layouts/main-layout",
      title: "Instructor Info",
      instructor,
      user,
      courses,
      priceFormat,
      totalStudent: totalStudent.dataValues.total_student,
    });
  },

  /**
   * Render learning page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  learn: async (req, res) => {
    res.render("course/learning", {
      layout: "layouts/main-layout",
      title: "",
    });
  },
};
