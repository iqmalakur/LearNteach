module.exports = {
  index: (req, res) => {
    res.render('payment/index', {
      layout: 'layouts/main-layout',
      title: 'Payment Page',
    });
  },
  cart: (req, res) => {
    res.render('payment/cart', {
      layout: 'layouts/main-layout',
      title: 'Cart',
    });
  },
};
