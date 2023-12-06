const Joi = require("joi");
const {
  Connection,
  User,
  Instructor,
  Course,
  Community,
  Content,
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
      const contents = await Content.findAll({
        where: { course: course.id },
        order: [["created_at", "ASC"]],
      });

      res.render("instructor/course-dashboard", {
        layout: "layouts/instructor-layout",
        title: "Course",
        course,
        user,
        contents,
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
        layout: "layouts/instructor-layout",
        title: "Course",
        user,
        url: req.originalUrl,
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
      // Set http header
      res.set("Content-Type", "application/json; charset=utf-8");

      // Request body validation
      const schema = Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required().max(80),
        description: Joi.string().optional(),
        price: Joi.number().required(),
        // tags: Joi.string().required(),
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

      const { id, title, description, price, meet_link, meet_day, meet_time } =
        req.body;

      const course = await Course.findByPk(id);

      course.title = title;
      course.description = description;
      course.price = price;
      course.meet_link = meet_link;
      course.meet_day = meet_day;
      course.meet_time = meet_time;

      if (course.save()) {
        return res.status(200).json({
          success: true,
          message: "success update course",
          redirect: "/instructor/courses/" + id,
        });
      }

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
        // tags: Joi.string().required(),
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
      const t = await Connection.getConnection().transaction();
      let success = false;

      try {
        const preview = req.files.preview[0].filename;
        const course = await Course.create(
          {
            ...req.body,
            preview,
            tags: "",
            description: req.body.description ?? "",
            rating: 0,
            members: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { transaction: t }
        );

        await Community.create(
          {
            course: course.id,
            name: course.title + " Community",
            type: "local",
          },
          { transaction: t }
        );

        success = true;

        await t.commit();
      } catch (error) {
        await t.rollback();

        return res.status(500).json({
          success: false,
          message: "unexpected errors occurred",
          redirect: null,
        });
      }

      if (success) {
        return res.status(201).json({
          success: true,
          message: "success create new course",
          redirect: "/instructor/courses",
        });
      }

      return res.status(500).json({
        success: false,
        message: "unexpected errors occurred",
        redirect: null,
      });
    },

    /**
     * Handle upload course preview.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    upload: async (req, res) => {
      const filename = req.files.preview[0].filename;

      const course = await Course.findByPk(req.params.courseId);
      course.picture = filename;
      course.save();

      return res.status(200).json({
        success: true,
        message: "success change course preview",
      });
    },
    content: {
      /**
       * Render add course content page
       *
       * @param {Request} req The Request object.
       * @param {Response} res The Response object.
       */
      show: async (req, res) => {
        const user = res.locals.user;
        const course = await Course.findOne({
          where: { instructor: user.username },
        });

        res.render("instructor/content", {
          layout: "layouts/instructor-layout",
          title: "Add Content",
          user,
          course,
          url: req.originalUrl,
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

        const t = await Connection.getConnection().transaction();

        try {
          const course = await Course.findOne(
            {
              where: { id: courseId },
            },
            { transaction: t }
          );

          // Check if course is not found
          if (!course) {
            return res.status(404).json({
              success: false,
              message: `course with id ${courseId} is not found!`,
              redirect: null,
            });
          }

          // Create content
          const filename = req.files.file[0].filename;
          await Content.create(
            {
              ...req.body,
              approved: "no",
              course: courseId,
              video: filename,
              created_at: new Date(),
            },
            { transaction: t }
          );

          await Connection.getConnection().query(
            `UPDATE enrolledcourses SET completed_contents=CONCAT(completed_contents, ',false') WHERE course='${courseId}';`,
            { transaction: t }
          );

          await t.commit();

          // Send response
          const message = "success create new content";
          res.cookie("successMessage", message);

          return res.status(201).json({
            success: true,
            message,
            redirect: "/instructor/courses/" + courseId,
          });
        } catch (err) {
          await t.rollback();

          return res.status(500).json({
            success: false,
            message: "unexpected errors occurred",
            redirect: null,
          });
        }

        return res.status(500).json({
          success: false,
          message: "unexpected errors occurred",
          redirect: null,
        });
      },
    },
  },
};
