const Joi = require("joi");
const bcrypt = require("bcrypt");
const {
  Connection,
  User,
  Instructor,
  Course,
  EnrolledCourse,
  Wishlist,
  Cart,
} = require("../models/Database");
const { priceFormat } = require("../utils/format");

module.exports = {
  /**
   * Render user dashboard page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const user = res.locals.user;

    const enrolledCourses = await EnrolledCourse.findAll({
      where: { user: user.username },
      attributes: ["completed_contents"],
      include: [
        {
          model: Course,
          attributes: ["id", "title", "description", "preview"],
        },
      ],
    });

    let courses = [];
    let activeCourse = 0;
    let completedCourse = 0;

    enrolledCourses.forEach((enrolledCourse) => {
      const course = enrolledCourse.Course;
      const completedContents = enrolledCourse.completed_contents.split(",");

      const completedCount = completedContents.filter(
        (status) => status === "true"
      ).length;
      const progress = (completedCount / completedContents.length) * 100;

      course.progress = progress.toFixed();

      if (completedContents.every((status) => status === "true")) {
        completedCourse++;
        course.status = "Completed";
      } else {
        activeCourse++;
        course.status = "Uncompleted";
      }

      const description = course.description;
      course.description =
        description.length > 80
          ? description.substring(0, 80) + "..."
          : description;

      courses.push(course);
    });

    courses = courses.sort((a, b) => b.progress - a.progress);

    res.render("user/index", {
      layout: "layouts/sidebar-layout",
      title: "Dashboard",
      user,
      courses,
      activeCourse,
      completedCourse,
      url: req.originalUrl,
    });
  },

  /**
   * Render user course page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  course: async (req, res) => {
    const user = res.locals.user;
    const enrolledCourses = await EnrolledCourse.findAll({
      where: { user: user.username },
      include: [
        {
          model: Course,
          include: [
            {
              model: User,
              attributes: ["username", "name"],
            },
          ],
        },
      ],
      attributes: ["completed_contents"],
    });
    const courses = [];

    enrolledCourses.forEach((enrolledCourse) => {
      const completed_contents = enrolledCourse.completed_contents.split(",");
      const completed_count = completed_contents.filter(
        (c) => c === "true"
      ).length;

      const course = enrolledCourse.Course;
      const progress = (completed_count / completed_contents.length) * 100;
      course.progress = progress.toFixed();

      courses.push(course);
    });

    res.render("user/course", {
      layout: "layouts/sidebar-layout",
      title: "My Course",
      user,
      courses,
      priceFormat,
      url: req.originalUrl,
    });
  },

  /**
   * Render user profile page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  profile: (req, res) => {
    const user = res.locals.user;

    res.render("user/profile", {
      layout: "layouts/main-layout",
      title: "My Profile",
      user,
    });
  },

  /**
   * Handle update user profile process.
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   * @return {ServerResponse}
   */
  update: async (req, res) => {
    // Set http header
    res.set("Content-Type", "application/json; charset=utf-8");

    // Request body validation
    const schema = Joi.object({
      name: Joi.string().optional(),
      bio: Joi.string().optional(),
      username: Joi.string().required(),
      email: Joi.string().optional().email(),
      password: Joi.string().optional().min(0),
      confirmPassword: Joi.string().optional().min(0),
    });

    const valid = schema.validate(req.body);
    if (valid.error) {
      return res.status(400).json({
        success: false,
        message: valid.error.details[0].message,
        data: null,
      });
    }

    // Destructuring request body
    const { name, bio, username, email, password, confirmPassword } = req.body;

    // Check if the user does not exists
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "username does not exists",
        data: null,
      });
    }

    // If password is changed
    if (password.length !== 0) {
      // Check if password not equals to confirm password
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "password is not equals to confirm password",
          data: null,
        });
      }

      // Check if password length is less then 8 characters
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: '"password" length must be at least 8 characters long',
          data: null,
        });
      }

      // Encrypt the password
      if (!bcrypt.compareSync(password, user.password)) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
      }
    }

    // Set all data to new data
    user.name = name;
    user.email = email;

    // Store new user to database
    if (await user.save()) {
      const instructor = await Instructor.findOne({
        where: { username: user.username },
        attributes: ["username", "bio"],
      });
      instructor.bio = bio;
      await instructor.save();

      return res.status(200).json({
        success: true,
        message: "success update profile",
        data: { name: user.name, email: user.email, bio: instructor.bio },
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "unexpected errors occurred",
        data: null,
      });
    }
  },

  /**
   * Handle upload user picture.
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   * @return {ServerResponse}
   */
  upload: async (req, res) => {
    const file = req.file;

    const filename = file.filename;
    const splittedFilename = filename.split(".");
    splittedFilename.pop();
    const username = splittedFilename.join(".");

    const user = await User.findByPk(username);
    user.picture = filename;
    user.save();

    return res.status(200).json({
      success: true,
      message: "success change profile picture",
      data: { filename },
    });
  },
  wishlist: {
    /**
     * Render user wishlist page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: async (req, res) => {
      const user = res.locals.user;

      const wishlists = await Wishlist.findAll({
        where: { user: user.username },
        include: [
          {
            model: Course,
            attributes: [
              "id",
              "title",
              "description",
              "preview",
              "rating",
              "members",
              "price",
            ],
            include: [{ model: User, attributes: ["name"] }],
          },
        ],
        attributes: ["id"],
      });

      res.render("user/wishlist", {
        layout: "layouts/sidebar-layout",
        title: "Wishlist",
        user,
        wishlists,
        priceFormat,
        url: req.originalUrl,
      });
    },

    /**
     * Handle add course to wishlist process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    add: async (req, res) => {
      // Destructuring request body
      const { user, course } = req.body;

      // Check if course already enrolled
      if (await EnrolledCourse.findOne({ where: { user, course } })) {
        return res.status(409).json({
          success: false,
          message: "course has been enrolled",
          redirect: null,
        });
      }

      // Check if wishlist already exists
      if (await Wishlist.findOne({ where: { user, course } })) {
        return res.status(409).json({
          success: false,
          message: "course already added to wishlist",
          redirect: null,
        });
      }

      // Check if user is instructor
      if (await Course.findOne({ where: { id: course, instructor: user } })) {
        return res.status(409).json({
          success: false,
          message: "you can't add your course to wishlist",
          redirect: null,
        });
      }

      // Check if the course is on the cart
      const t = await Connection.getConnection().transaction();
      if (await Cart.findOne({ where: { user, course } })) {
        try {
          await Cart.destroy({ where: { user, course }, transaction: t });
          await Wishlist.create({ user, course }, { transaction: t });

          await t.commit();

          return res.status(200).json({
            success: true,
            message: "course moved from cart to wishlist",
            redirect: null,
          });
        } catch (error) {
          await t.rollback();

          return res.status(500).json({
            success: false,
            message: "unexpected errors occurred",
            redirect: null,
          });
        }
      }

      // Success add to wishlist
      await Wishlist.create({ user, course });
      return res.status(200).json({
        success: true,
        message: "course added to wishlist",
        redirect: null,
      });
    },

    /**
     * Handle remove course from wishlist process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    remove: async (req, res) => {
      // Destructuring request body
      const { id } = req.body;

      // Remove course from wishlist
      await Wishlist.destroy({ where: { id } });

      // Success remove course from wishlist
      return res.status(200).json({
        success: true,
        message: "course removed from wishlist",
        redirect: null,
      });
    },
  },
};
