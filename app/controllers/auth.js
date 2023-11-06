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
    submit: (req, res) => {
      const body = req.body;

      // decrypt password
      // const isPasswordValid = bcrypt.compareSync(password, hashedPassword);

      res.send("ok");
    },
  },
  register: {
    show: (req, res) => {
      res.render("auth/register", {
        layout: "layouts/main-layout",
        title: "Register",
      });
    },
    submit: async (req, res) => {
      const body = req.body;
      const {
        fullname,
        username,
        email,
        password,
        confirmPassword,
        termsCondition,
      } = body;

      let success = false;
      let message = "";
      let code = 400;
      let data = null;

      res.set("Content-Type", "application/json; charset=utf-8");

      if (!fullname) message = "Full Name field is required!";
      else if (!email) message = "Email field is required!";
      else if (!password) message = "Password field is required!";
      else if (!confirmPassword)
        message = "Confirm Password field is required!";
      else if (!termsCondition || termsCondition === "false")
        message = "Terms and Conditions must be checked!";
      else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
        message = "Email is not valid!";
      else if (password.length < 8)
        message = "Password must be at least 8 characters!";
      else if (password !== confirmPassword)
        message = "Password is not match with Confirm Password!";
      else {
        const user = new User({
          name: fullname,
          username,
          email,
          password,
        });

        if (await user.isExist()) {
          code = 409;
          message = "Username already exists!";
        } else {
          const hashedPassword = bcrypt.hashSync(password, 10);
          user.setPassword(hashedPassword);

          if (await user.save()) {
            code = 201;
            success = true;
            message = "User registration is successful";
            data = user.get();
          } else {
            code = 500;
            message = "Unexpected errors occurred";
          }
        }
      }

      res.status(code);
      res.json({ success, message, code, data });
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
