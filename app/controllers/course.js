const sequelize = require("sequelize");
const { Op } = require("sequelize");
const {
  Connection,
  User,
  Instructor,
  Course,
  Content,
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
    const keyword = req.query.keyword ?? "";
    const sort = req.query.sort ?? "id";
    const direction = req.query.direction ?? "ASC";

    let courses = null;
    let order = [
      [sort !== "" ? sort : "id", direction !== "" ? direction : "ASC"],
    ];

    if (sort === "instructor") {
      order = [[User, "name", direction !== "" ? direction : "ASC"]];
    }

    courses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            "$User.name$": {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      order,
    });

    if (keyword) {
      courses = courses.map((course) => {
        const regex = new RegExp(keyword, "gim");

        course.title = course.title.replace(
          regex,
          (val) => `<mark class="match">${val}</mark>`
        );

        course.User.name = course.User.name.replace(
          regex,
          (val) => `<mark class="match">${val}</mark>`
        );

        return course;
      });
    }

    res.render("course/index", {
      layout: "layouts/main-layout",
      title: "Course List",
      user,
      courses,
      keyword,
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
    const user = res.locals.user;
    const courseId = req.params.courseId;
    const contentId = req.params.contentId;

    const enrolledCourse = await EnrolledCourse.findOne({
      where: {
        user: user.username,
        course: courseId,
      },
    });

    if (!enrolledCourse) {
      return res.redirect("/my/course");
    }

    const completed_contents = enrolledCourse.completed_contents.split(",");

    if (!contentId) {
      const contents = await Content.findAll({
        attributes: ["id"],
        where: { course: courseId },
        order: [["created_at", "ASC"]],
      });

      let uncompleted_content = completed_contents.indexOf("false");

      if (uncompleted_content >= 0) {
        return res.redirect(
          `/learn/${courseId}/${contents[uncompleted_content].id}`
        );
      }

      if (contents.length > 0) {
        return res.redirect(`/learn/${courseId}/${contents[0].id}`);
      }

      return res.redirect(`/my/course`);
    }

    const course = await Course.findOne({
      attributes: [
        "id",
        "title",
        "rating",
        "members",
        "meet_link",
        "meet_time",
        "meet_day",
        "description",
      ],
      where: { id: courseId },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const contents = await Content.findAll({
      attributes: ["id", "label"],
      where: { course: courseId },
      order: [["created_at", "ASC"]],
    });

    const content = await Content.findOne({
      where: { id: contentId },
    });

    res.render("course/learning", {
      layout: "layouts/raw-layout",
      title: "Learn",
      user,
      course,
      enrolledCourse,
      content,
      contents,
      completed_contents,
    });
  },

  /**
   * Handle completed content proccess
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  complete: async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.body.username;
    const index = req.body.index;
    const state = req.body.state;

    const enrolledCourse = await EnrolledCourse.findOne({
      where: { course: courseId, user: username },
    });

    const completed_contents = enrolledCourse.completed_contents.split(",");
    completed_contents[index] = state;
    enrolledCourse.completed_contents = completed_contents.join(",");

    if (enrolledCourse.save()) {
      return res.status(200).json({
        success: true,
        state,
      });
    }

    return res.status(500).json({
      success: false,
      message: "unexpected errors occurred",
      redirect: null,
    });
  },

  /**
   * Handle user rating proccess
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  rating: async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.body.username;
    const rating = req.body.rating;

    const enrolledCourse = await EnrolledCourse.findOne({
      where: { course: courseId, user: username },
    });

    const course = await Course.findOne({
      where: { id: courseId },
      attributes: ["id", "instructor", "rating"],
    });

    const t = await Connection.getConnection().transaction();
    const prevRating = enrolledCourse.rating;
    const prevCourseRating = course.rating;

    try {
      enrolledCourse.rating = rating;
      await enrolledCourse.save();

      const avgRating = await EnrolledCourse.findOne(
        {
          where: { course: courseId, rating: { [Op.ne]: 0 } },
          attributes: [
            [sequelize.fn("AVG", sequelize.col("rating")), "avg_rating"],
          ],
        },
        { transaction: t }
      );

      course.rating = Number(avgRating.dataValues.avg_rating).toFixed();
      await course.save();

      const instructor = await Instructor.findOne({
        where: { username: course.instructor },
        attributes: ["username", "rating"],
      });

      const avgCourseRating = await Course.findOne(
        {
          where: { instructor: instructor.username, rating: { [Op.ne]: 0 } },
          attributes: [
            [sequelize.fn("AVG", sequelize.col("rating")), "avg_rating"],
          ],
        },
        { transaction: t }
      );

      instructor.rating = Number(
        avgCourseRating.dataValues.avg_rating
      ).toFixed();
      await instructor.save({ transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        rating: enrolledCourse.rating,
      });
    } catch (err) {
      await t.rollback();

      console.log(err);

      enrolledCourse.rating = prevRating;
      await enrolledCourse.save();

      course.rating = prevCourseRating;
      await course.save();

      return res.status(500).json({
        success: false,
        message: "unexpected errors occurred",
        redirect: null,
      });
    }
  },
};
