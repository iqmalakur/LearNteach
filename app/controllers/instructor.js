const Joi = require("joi");
const {
  Instructor,
  Course,
  Content,
  Video,
  Article,
} = require("../models/Database");

module.exports = {
  /**
   * Render instructor dashboard page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: (req, res) => {
    res.render("instructor/index", {
      layout: "layouts/raw-layout",
      title: "Instructor - Dashboard",
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
      res.render("instructor/register", {
        layout: "layouts/main-layout",
        title: "Register",
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
      // Set http header
      res.set("Content-Type", "application/json; charset=utf-8");

      // Request body validation
      const schema = Joi.object({
        username: Joi.string().required(),
        document: Joi.string().required().uri(),
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
      const { username, document } = req.body;

      // Check if instructor already registered
      const instructor = await Instructor.findOne({ where: { username } });
      if (instructor) {
        return res.status(409).json({
          success: false,
          message: "instructor already registered",
          redirect: null,
        });
      }

      // Store new user to database
      if (
        await instructor.create({
          username,
          document,
          balance: 0,
          rating: 0,
          bio: "",
          approved: "yes",
        })
      ) {
        const message = "instructor registration is successful";
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
  },
  course: {
    /**
     * Render instructor course dashboard page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    detail: async (req, res) => {
      const courses = await Course.getAll();

      res.render("instructor/course", {
        layout: "layouts/main-layout",
        title: "Course",
        courses,
      });
    },

    /**
     * Render instructor add course page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: (req, res) => {
      res.render("instructor/add-course", {
        layout: "layouts/main-layout",
        title: "Course",
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
        res.render("instructor/content", {
          layout: "layouts/main-layout",
          title: "Add Content",
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
        res.render("instructor/quiz", {
          layout: "layouts/raw-layout",
          title: "Add Quiz",
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
