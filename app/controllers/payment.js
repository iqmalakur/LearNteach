const { cart } = require("../models/Connection");

module.exports = {
  /**
   * Render payment page
   *
   * @param {Request} req The Request object.
   * @param {Response} res The Response object.
   */
  index: (req, res) => {
    res.render("payment/index", {
      layout: "layouts/main-layout",
      title: "Payment Page",
    });
  },

  cart: {
    /**
     * Render user cart page
     *
     * @param {Request} req The Request object.
     * @param {Response} res The Response object.
     */
    show: (req, res) => {
      res.render("payment/cart", {
        layout: "layouts/raw-layout",
        title: "Cart",
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
      const { username: user, course } = req.body;

      // Check if cart already exists
      if (await cart.findOne({ where: { user, course } })) {
        return res.status(409).json({
          success: false,
          message: "course already added to cart",
          redirect: null,
        });
      }

      // Success add to cart
      cart.create({ user, course });
      return res.status(200).json({
        success: true,
        message: "course added to cart",
        redirect: null,
      });
    },
  },
};
