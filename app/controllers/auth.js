const Model = require("../models/Model");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
  login: {
    show: (req, res) => {
      res.render("auth/login", {
        layout: "layouts/main-layout",
        title: "Login",
      });
    },
    submit: async (req, res) => {
      const { username, password } = req.body;

      let success = false;
      let message = "";
      let code = 400;
      let data = null;

      res.set("Content-Type", "application/json; charset=utf-8");

      if (!username) message = "Username field is required!";
      else if (!password) message = "Password field is required!";
      else {
        const user =
          (await User.get(username)) ?? (await User.getEmail(username));
        const isPasswordValid = user
          ? bcrypt.compareSync(password, user.password)
          : false;

        if (user && isPasswordValid) {
          if (await user.save()) {
            code = 200;
            success = true;
            message = "User login is successful";
            data = user.get();
          } else {
            code = 500;
            message = "Unexpected errors occurred";
          }
        } else {
          code = 401;
          message = "Incorrect username or password";
        }
      }

      res.status(code);
      res.json({ success, message, code, data });
    },
  },
  register: {
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
          code: 400,
          data: null,
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
          code: 400,
          data: null,
        });
      }

      // Terms and Condition validation
      if (termsCondition !== "true") {
        return res.status(400).json({
          success: false,
          message: '"termsCondition" must be checked',
          code: 400,
          data: null,
        });
      }

      // Check if the user already exists
      const user = new User({ name, username, email, password });
      if (await user.isExist()) {
        return res.status(409).json({
          success: false,
          message: "username already exists",
          code: 409,
          data: null,
        });
      }

      // Encrypt the password
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.setPassword(hashedPassword);

      // Store new user to database
      if (await user.save()) {
        return res.status(201).json({
          success: true,
          message: "user registration is successful",
          code: 201,
          data: user.get(),
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "unexpected errors occurred",
          code: 500,
          data: null,
        });
      }
    },
  },
  recovery: {
    show: (req, res) => {
      res.render("auth/recovery", {
        layout: "layouts/main-layout",
        title: "Forgot Password",
      });
    },
    submit: (req, res) => {
      res.send("ok");
    },
  },
};
