module.exports = {
  index: (req, res) => {
    res.render('index', { title: 'LearNteach' });
  },
  faq: (req, res) => {
    res.render('faq', { title: 'Frequently Asked Question' });
  },
};
