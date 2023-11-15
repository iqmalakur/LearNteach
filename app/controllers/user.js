const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { Wishlist } = require("../models/Connection");
const { verifyToken } = require("../utils/jwt");

module.exports = {
  /**
   * Render user dashboard page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: (req, res) => {
    res.render("user/index", {
      layout: "layouts/raw-layout",
      title: "Dashboard",
    });
  },

  /**
   * Render user profile page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  profile: (req, res) => {
    res.render("user/profile", {
      layout: "layouts/main-layout",
      title: "My Profile",
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
      picture: Joi.string().required().uri(),
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
    const user = await User.get(username);
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
      user.setPassword(hashedPassword);
    }

    // Set all data to new data
    user.setName(name).setEmail(email).setPicture(picture);

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
      const token = req.cookies.token;
      const username = verifyToken(token)?.username;
      const user = await User.get(username);

      const wishlists = await Wishlist.findAll({
        where: { user: user.username },
      });

      res.render("user/wishlist", {
        layout: "layouts/main-layout",
        title: "Wishlist",
        wishlists,
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
      const { username: user, course } = req.body;

      // Check if wishlist already exists
      if (await Wishlist.findOne({ where: { user, course } })) {
        return res.status(409).json({
          success: false,
          message: "course already added to wishlist",
          redirect: null,
        });
      }

      // Success add to wishlist
      Wishlist.create({ user, course });
      return res.status(200).json({
        success: true,
        message: "course added to wishlist",
        redirect: null,
      });
    },
  },
};
