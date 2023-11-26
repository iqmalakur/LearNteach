const Joi = require("joi");
const bcrypt = require("bcrypt");
const {
  Connection,
  User,
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
  index: (req, res) => {
    const user = res.locals.user;

    res.render("user/index", {
      layout: "layouts/sidebar-layout",
      title: "Dashboard",
      user,
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
      attributes: [],
    });
    const courses = [];

    enrolledCourses.forEach((enrolledCourse) =>
      courses.push(enrolledCourse.Course)
    );

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
   * Render user quiz page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  quiz: (req, res) => {
    const user = res.locals.user;

    res.render("user/quiz", {
      layout: "layouts/sidebar-layout",
      title: "My Quiz",
      user,
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
      name: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      picture: Joi.string().required(),
    });

    const valid = schema.validate(req.body);
    if (valid.error) {
      return res.status(400).json({
        success: false,
        message: valid.error.details[0].message,
        redirect: null,
      });
    }

    // Destructuring request body
    const { name, username, email, password, picture } = req.body;

    // Check if the user does not exists
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "username does not exists",
        redirect: null,
      });
    }

    // Encrypt the password
    if (!bcrypt.compareSync(password, user.password)) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.password = hashedPassword;
    }

    // Set all data to new data
    user.name = name;
    user.email = email;
    user.picture = picture;

    // Store new user to database
    if (await user.save()) {
      const message = "success update profile";
      res.cookie("successMessage", message);

      return res.status(200).json({
        success: true,
        message,
        redirect: "/my/profile",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "unexpected errors occurred",
        redirect: null,
      });
    }
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
