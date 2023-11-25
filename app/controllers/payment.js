const {
  Connection,
  User,
  Course,
  Wishlist,
  Cart,
  Transaction,
  EnrolledCourse,
} = require("../models/Database");
const { verifyToken } = require("../utils/jwt");
const { priceFormat } = require("../utils/format");

module.exports = {
  /**
   * Render payment page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: async (req, res) => {
    const user = res.locals.user;
    const carts = await Cart.findAll({
      where: { user: user.username },
      include: [
        {
          model: Course,
          attributes: ["title", "preview", "price"],
        },
      ],
      attributes: [],
    });

    let totalPrice = 0;
    const courses = [];
    carts.forEach((cart) => {
      totalPrice += cart.Course.price;
      courses.push(cart.Course);
    });

    res.render("payment/index", {
      layout: "layouts/raw-layout",
      title: "Payment Page",
      user,
      courses,
      priceFormat,
      totalPrice,
    });
  },

  /**
   * Handle transaction process.
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   * @return {ServerResponse}
   */
  transaction: async (req, res) => {
    const user = await verifyToken(req.cookies.token);
    const carts = await Cart.findAll({ where: { user: user.username } });

    if (carts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "cart is empty",
        redirect: null,
      });
    }

    const t = await Connection.getConnection().transaction();

    try {
      for (const cart of carts) {
        const course = await Course.findOne({
          where: { id: cart.course },
          include: [
            {
              model: User,
              attributes: ["name"],
            },
          ],
          transaction: t,
        });

        if (
          await EnrolledCourse.findOne({
            where: { user: user.username, course: course.id },
            transaction: t,
          })
        ) {
          throw new Error(`enrolled;${course.title}`);
        }

        // if (promotion_codes.length != 0) {
        //   const promo =
        //     promotion_codes[
        //       Math.floor(Math.random() * promotion_codes.length)
        //     ];

        //   promotion_code = promo.code;
        //   discount_percentage = promo.discount;
        // }

        const transaction = {
          user: user.username,
          course: course.id,
          course_title: course.title,
          user_name: user.name,
          instructor_name: course.User.name,
          transaction_date: new Date(),
          discount_percentage: 0,
          promotion_code: null,
        };

        transaction.course_price = course.price;
        transaction.tax = Math.floor(transaction.course_price * 0.1);
        transaction.discount =
          (transaction.discount_percentage / 100) * transaction.course_price;
        transaction.price =
          transaction.course_price - transaction.tax - transaction.discount;
        transaction.total = transaction.price + transaction.tax;

        const enrolledcourse = {
          user: user.username,
          course: course.id,
          completed_contents: "",
          quiz_grades: "",
        };

        await Transaction.create(transaction, { transaction: t });
        await EnrolledCourse.create(enrolledcourse, { transaction: t });
        await Cart.destroy({
          where: { user: user.username, course: course.id },
          transaction: t,
        });

        await Course.update(
          { members: course.members + 1 },
          {
            where: {
              id: course.id,
            },
            transaction: t,
          }
        );
      }

      await t.commit();
    } catch (error) {
      await t.rollback();

      if (error.message.startsWith("enrolled")) {
        return res.status(409).json({
          success: false,
          message: `${error.message.split(";")[1]} has been enrolled`,
          redirect: null,
        });
      }

      return res.status(500).json({
        success: false,
        message: "unexpected errors occurred",
        redirect: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "transaction successful",
      redirect: "/my/course",
    });
  },

  cart: {
    /**
     * Render user cart page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: async (req, res) => {
      const user = res.locals.user;

      const carts = await Cart.findAll({
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

      let total = 0;
      carts.forEach((cart) => (total += cart.Course.price));

      res.render("payment/cart", {
        layout: "layouts/raw-layout",
        title: "Cart",
        carts,
        priceFormat,
        user,
        total,
      });
    },

    /**
     * Handle add course to cart process.
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

      // Check if cart already exists
      if (await Cart.findOne({ where: { user, course } })) {
        return res.status(409).json({
          success: false,
          message: "course already added to cart",
          redirect: null,
        });
      }

      // Check if the course is on the wishlist
      const t = await Connection.getConnection().transaction();
      if (await Wishlist.findOne({ where: { user, course } })) {
        try {
          await Wishlist.destroy({ where: { user, course }, transaction: t });
          await Cart.create({ user, course }, { transaction: t });

          await t.commit();

          return res.status(200).json({
            success: true,
            message: "course moved from wishlist to cart",
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

      // Success add to cart
      await Cart.create({ user, course });
      return res.status(200).json({
        success: true,
        message: "course added to cart",
        redirect: null,
      });
    },

    /**
     * Handle remove course from cart process.
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     * @return {ServerResponse}
     */
    remove: async (req, res) => {
      // Destructuring request body
      const { id } = req.body;

      // Remove course from cart
      await Cart.destroy({ where: { id } });

      // Success remove course from cart
      return res.status(200).json({
        success: true,
        message: "course removed from cart",
        redirect: null,
      });
    },
  },
};
