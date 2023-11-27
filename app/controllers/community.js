const {
  User,
  Course,
  Community,
  Chat,
  EnrolledCourse,
} = require("../models/Database");
const { Op } = require("sequelize");

module.exports = {
  /**
   * Render community page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const user = res.locals.user;

    const enrolledCourses = await EnrolledCourse.findAll({
      include: [
        {
          model: Course,
          attributes: ["id", "instructor", "members"],
        },
      ],
      attributes: [],
      where: {
        "$EnrolledCourse.user$": user.username,
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
      where: { instructor: user.username },
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
      url: req.originalUrl,
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
    const beforeId = req.query.before;

    const community = await Community.findOne({
      where: { id: communityId },
      attributes: ["id", "course", "name"],
    });

    const user = res.locals.user;

    if (!community) {
      return res.render("error", {
        layout: "layouts/error-layout",
        title: "Page Not Found!",
        user,
        code: 404,
        errorTitle: "Sorry, page not found",
        errorSubTitle: "The page you requested could not be found",
      });
    }

    if (beforeId) {
      const chats = await Chat.findAll({
        where: { community: community.id, id: { [Op.lt]: beforeId } },
        attributes: ["id", "chat", "chat_date", "user"],
        order: [["id", "DESC"]],
        limit: 11,
        include: [{ model: User, attributes: ["username", "name", "picture"] }],
      });

      const next = chats.length > 10;
      if (chats.next) {
        chats.pop();
      }

      return res.status(200).json({
        success: true,
        next,
        chats,
      });
    }

    const course = await Course.findOne({
      where: { id: community.course },
      attributes: ["id", "instructor", "members"],
    });

    const isInstructor = course.instructor === user.username;

    if (!isInstructor) {
      const validUser = await EnrolledCourse.findOne({
        where: { user: user.username, course: course.id },
      });

      if (!validUser) {
        return res.redirect("/my/community");
      }
    }

    const instructor = await User.findOne({
      where: { username: course.instructor },
      attributes: ["username", "name", "picture"],
    });

    const chats = await Chat.findAll({
      where: { community: community.id },
      attributes: ["id", "chat", "chat_date", "user"],
      order: [["id", "DESC"]],
      limit: 11,
      include: [{ model: User, attributes: ["username", "name", "picture"] }],
    });

    const next = chats.length > 10;
    if (next) {
      chats.pop();
    }

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
          [Op.ne]: user.username,
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
      next,
      isInstructor,
      url: req.originalUrl,
    });
  },
};
