const Joi = require("joi");
const {
  User,
  Instructor,
  Course,
  Content,
  Video,
  Article,
} = require("../models/Database");
const { priceFormat } = require("../utils/format");

module.exports = {
  /**
   * Render instructor dashboard page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: (req, res) => {
    const user = res.locals.user;

    res.render("instructor/index", {
      layout: "layouts/instructor-layout",
      title: "Instructor - Dashboard",
      user,
      url: req.originalUrl,
    });
  },

  register: {
    /**
     * Render instructor register page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: (req, res) => {
      const user = res.locals.user;

      res.render("instructor/register", {
        layout: "layouts/main-layout",
        title: "Register",
        user,
      });
    },

    /**
     * Handle register instructor process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    submit: async (req, res) => {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: "document is not allowed to be empty",
          redirect: null,
        });
      }

      const filename = file.filename;
      const splittedFilename = filename.split(".");
      splittedFilename.pop();
      const username = splittedFilename.join(".");

      const instructor = await Instructor.create({
        username,
        document: filename,
        balance: 0,
        approved: "yes",
        bio: "",
        rating: 0,
      });

      if (instructor) {
        return res.status(201).json({
          success: true,
          message: "instructor registration is successful",
          redirect: "/instructor",
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
  course: {
    /**
     * Render instructor course page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    index: async (req, res) => {
      const user = res.locals.user;
      const courses = await Course.findAll({
        where: { instructor: user.username },
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });

      res.render("instructor/course", {
        layout: "layouts/instructor-layout",
        title: "Course",
        courses,
        user,
        priceFormat,
        url: req.originalUrl,
      });
    },

    /**
     * Render instructor course dashboard page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    detail: async (req, res) => {
      const user = res.locals.user;
      const course = await Course.findOne({
        where: { instructor: user.username, id: req.params.courseId },
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });

      res.render("instructor/course-dashboard", {
        layout: "layouts/instructor-layout",
        title: "Course",
        course,
        user,
        priceFormat,
        url: req.originalUrl,
      });
    },

    /**
     * Render instructor add course page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: (req, res) => {
      const user = res.locals.user;

      res.render("instructor/add-course", {
        layout: "layouts/main-layout",
        title: "Course",
        user,
      });
    },

    /**
     * Handle update course process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    update: async (req, res) => {
      return res.status(500).json({
        success: false,
        message: "unexpected errors occurred",
        redirect: null,
      });
    },

    /**
     * Handle add course process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    add: async (req, res) => {
      // Set http header
      res.set("Content-Type", "application/json; charset=utf-8");

      // Request body validation
      const schema = Joi.object({
        instructor: Joi.string().required(),
        title: Joi.string().required().max(80),
        description: Joi.string().optional(),
        price: Joi.number().required(),
        tags: Joi.string().required(),
        meet_link: Joi.string().required(),
        meet_day: Joi.string().required(),
        meet_time: Joi.string().required(),
      });

      const valid = schema.validate(req.body);
      if (valid.error) {
        return res.status(400).json({
          success: false,
          message: valid.error.details[0].message,
          redirect: null,
        });
      }

      // Create new Course
      const course = await Course.create({
        ...req.body,
        preview: "https://source.unsplash.com/random",
        description: req.body.description ?? "",
        rating: 0,
        members: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (course) {
        const message = "success create new course";
        res.cookie("successMessage", message);

        return res.status(201).json({
          success: true,
          message,
          redirect: "/instructor",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "unexpected errors occurred",
          redirect: null,
        });
      }
    },
    content: {
      /**
       * Render add course content page
       *
       * @param {Request} req The Request object.
       * @param {Response} res The Response object.
       */
      show: (req, res) => {
        const user = res.locals.user;
        res.render("instructor/content", {
          layout: "layouts/main-layout",
          title: "Add Content",
          user,
        });
      },

      /**
       * Handle add course content process.
       *
       * @param {Request} req The Request object.
       * @param {Response} res The Response object.
       * @return {ServerResponse}
       */
      submit: async (req, res) => {
        // Get course with spesific id
        const { courseId } = req.params;
        const course = await Course.findOne({
          where: { id: courseId },
        });

        // Check if course is not found
        if (!course) {
          return res.status(404).json({
            success: false,
            message: `course with id ${courseId} is not found!`,
            redirect: null,
          });
        }

        // Create content
        const content = await Content.create({
          ...req.body,
          approved: "no",
          course: courseId,
        });

        // Check and create content type
        let result = null;
        if (content.type === "article") {
          result = await Article.create({
            id: content.id,
            body: req.body.body,
          });
        } else {
          result = await Video.create({
            id: content.id,
            body: req.body.file,
          });
        }

        // Send response
        if (result) {
          const message = "success create new content";
          res.cookie("successMessage", message);

          return res.status(201).json({
            success: true,
            message,
            redirect: "/instructor/courses/" + courseId,
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
    quiz: {
      /**
       * Render add course quiz page
       *
       * @param {Request} req The Request object.
       * @param {Response} res The Response object.
       */
      show: (req, res) => {
        const user = res.locals.user;

        res.render("instructor/quiz", {
          layout: "layouts/raw-layout",
          title: "Add Quiz",
          user,
        });
      },

      /**
       * Handle add course quiz process.
       *
       * @param {Request} req The Request object.
       * @param {Response} res The Response object.
       * @return {ServerResponse}
       */
      submit: (req, res) => {
        res.send("ok");
      },
    },
  },
};
