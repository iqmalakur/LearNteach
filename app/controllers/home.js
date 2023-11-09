module.exports = {
  index: (req, res) => {
    res.render('index', {
      layout: 'layouts/index-layout',
      title: 'LearNteach',
    });
  },
  faq: (req, res) => {
    res.render('faq', {
      layout: 'layouts/raw-layout',
      title: 'Frequently Asked Question',
    });
  },
};
