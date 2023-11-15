const Joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: {
    /**
     * Render login page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: (req, res) => {
      const successMessage = req.cookies.successMessage ?? false;

      if (successMessage) {
        res.clearCookie("successMessage");
      }

      res.render("auth/login", {
        layout: "layouts/main-layout",
        title: "Login",
        successMessage,
      });
    },

    /**
     * Handle the user login process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    submit: async (req, res) => {
      // Set http header
      res.set("Content-Type", "application/json; charset=utf-8");

      // Request body validation
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        rememberMe: Joi.any(),
      });
      const valid = schema.validate(req.body);
      if (valid.error) {
        return res.status(400).json({
          success: false,
          message: valid.error.details[0].message,
          redirect: null,
        });
      }

      // Destructuring request body and
      const { username, password } = req.body;

      // Find User by username or email and decrypt the password
      const user =
        (await User.get(username)) ?? (await User.getEmail(username));
      const isPasswordValid = user
        ? bcrypt.compareSync(password, user.password)
        : false;

      // Check if the username and password are incorrect
      if (!user || !isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "incorrect username or password",
          redirect: null,
        });
      }

      // Create JWT token
      const token = jwt.sign({ username }, "LearNteach-Sekodlah23", {
        expiresIn: "7d",
      });

      // Set browser cookie
      res.cookie("token", token, { httpOnly: true });

      const message = "user login is successful";
      res.cookie("successMessage", message);

      // Login success
      return res.status(200).json({
        success: true,
        message,
        redirect: "/",
      });
    },
  },
  register: {
    /**
     * Render register page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: (req, res) => {
      res.render("auth/register", {
        layout: "layouts/main-layout",
        title: "Register",
      });
    },

    /**
     * Handle the user registration process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    submit: async (req, res) => {
      // Set http header
      res.set("Content-Type", "application/json; charset=utf-8");

      // Request body validation
      const valid = User.validate(req.body);
      if (valid.error) {
        return res.status(400).json({
          success: false,
          message: valid.error.details[0].message,
          redirect: null,
        });
      }

      // Destructuring request body
      const {
        fullname: name,
        username,
        email,
        password,
        confirmPassword,
        termsCondition,
      } = req.body;

      // Password validation
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: '"password" is not equal to "confirmPassword"',
          redirect: null,
        });
      }

      // Terms and Condition validation
      if (!termsCondition) {
        return res.status(400).json({
          success: false,
          message: '"termsCondition" must be checked',
          redirect: null,
        });
      }

      // Check if the user already exists
      const user = new User({ name, username, email, password });
      if (await user.isExist()) {
        return res.status(409).json({
          success: false,
          message: "username already exists",
          redirect: null,
        });
      }

      // Encrypt the password
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.setPassword(hashedPassword);

      // Store new user to database
      if (await user.save()) {
        const message = "user registration is successful";
        res.cookie("successMessage", message);

        return res.status(201).json({
          success: true,
          message,
          redirect: "/login",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "unexpected errors occurred",
          redirect: null,
        });
      }
    },
  },
  recovery: {
    /**
     * Render forgot password page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: (req, res) => {
      res.render("auth/recovery", {
        layout: "layouts/main-layout",
        title: "Forgot Password",
      });
    },

    /**
     * Handle the recovery password process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    submit: async (req, res) => {
      // Set http header
      res.set("Content-Type", "application/json; charset=utf-8");

      // Request body validation
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });
      const valid = schema.validate(req.body);
      if (valid.error) {
        return res.status(400).json({
          success: false,
          message: valid.error.details[0].message,
          redirect: null,
        });
      }

      // Destructuring request body and
      const { email } = req.body;

      // Find User by username or email and decrypt the password
      const user = await User.getEmail(username);

      return res.status(503).json({
        success: false,
        message: "service unavailable",
        redirect: null,
      });
    },
  },

  /**
   * Handle the user logout process.
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   * @return {ServerResponse}
   */
  logout: (req, res) => {
    res.clearCookie("token");
    return res.redirect("/login");
  },
};
