const {
  User,
  Course,
  Community,
  Chat,
  EnrolledCourse,
} = require("../models/Database");
const { verifyToken } = require("../utils/jwt");
const { Op } = require("sequelize");

module.exports = {
  /**
   * Render community page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const token = req.cookies.token;
    const username = (await verifyToken(token))?.username;

    const user = await User.findOne({
      where: { username },
      attributes: ["username", "name", "picture"],
    });

    const enrolledCourses = await EnrolledCourse.findAll({
      include: [
        {
          model: Course,
          attributes: ["id", "instructor", "members"],
        },
      ],
      attributes: [],
      where: {
        "$EnrolledCourse.user$": username,
      },
    });

    const communities = [];

    for (const enrolledCourse of enrolledCourses) {
      const community = await Community.findOne({
        where: { course: enrolledCourse.Course.id },
        attributes: ["id", "name"],
      });

      const instructor = await User.findOne({
        where: { username: enrolledCourse.Course.instructor },
        attributes: ["name"],
      });

      communities.push({
        id: community.id,
        name: community.name,
        instructor: instructor.name,
        members: enrolledCourse.Course.members,
      });
    }

    const courses = await Course.findAll({
      where: { instructor: username },
      attributes: ["id", "members"],
    });

    for (const course of courses) {
      const community = await Community.findOne({
        where: { course: course.id },
        attributes: ["id", "name"],
      });

      communities.push({
        id: community.id,
        name: community.name,
        instructor: user.name,
        members: course.members,
      });
    }

    res.render("community/index", {
      layout: "layouts/sidebar-layout",
      title: "My Communities",
      user,
      communities,
    });
  },

  /**
   * Render community chat page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  chat: async (req, res) => {
    const communityId = req.params.communityId;
    const token = req.cookies.token;
    const username = (await verifyToken(token))?.username;

    const community = await Community.findOne({
      where: { id: communityId },
      attributes: ["id", "course", "name"],
    });

    if (!community) {
      return res.render("error", {
        layout: "layouts/error-layout",
        title: "Page Not Found!",
        code: 404,
        errorTitle: "Sorry, page not found",
        errorSubTitle: "The page you requested could not be found",
      });
    }

    const course = await Course.findOne({
      where: { id: community.course },
      attributes: ["id", "instructor", "members"],
    });

    const isInstructor = course.instructor === username;

    if (!isInstructor) {
      const validUser = await EnrolledCourse.findOne({
        where: { user: username, course: course.id },
      });

      if (!validUser) {
        return res.render("error", {
          layout: "layouts/error-layout",
          title: "Forbidden",
          code: 403,
          errorTitle: "You do not have access to this page",
          errorSubTitle: "Make sure you go to a page that is allowed to you",
        });
      }
    }

    const user = await User.findOne({
      where: { username },
      attributes: ["username", "name", "picture"],
    });

    const instructor = await User.findOne({
      where: { username: course.instructor },
      attributes: ["username", "name", "picture"],
    });

    const chats = await Chat.findAll({
      where: { community: community.id },
      attributes: ["chat", "chat_date", "user"],
      order: [["id", "DESC"]],
      limit: 10,
      include: [{ model: User, attributes: ["username", "name", "picture"] }],
    });

    const communityUsers = await EnrolledCourse.findAll({
      attributes: [],
      include: [
        {
          model: User,
          attributes: ["username", "name", "picture"],
        },
        {
          model: Course,
          attributes: [],
        },
      ],
      where: {
        "$Course.id$": communityId,
        "$User.username$": {
          [Op.ne]: username,
        },
      },
    });

    chats.reverse();

    // Get all users from chats
    let cacheUsers = [];
    for (const chat of chats) {
      let user = null;

      // Check if user already cached
      if ((user = cacheUsers.find((cacheUser) => cacheUser[0] === chat.user))) {
        chat.name = user[1];
      } else {
        user = await User.findOne({
          where: { username: chat.user },
          attributes: ["name"],
        });

        cacheUsers.push([chat.user, user.name]);
        chat.name = user.name;
      }
    }

    res.render("community/chat", {
      layout: "layouts/community-layout",
      title: community.name,
      chats,
      user,
      instructor,
      community,
      course,
      communityUsers,
      isInstructor,
    });
  },
};
