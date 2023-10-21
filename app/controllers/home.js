export const home = {
  index: (req, res) => {
    res.render('index', { layout: 'layouts/main-layout', title: 'LearNteach' });
  },
  faq: (req, res) => {
    res.render('faq', {
      layout: 'layouts/main-layout',
      title: 'Frequently Asked Question',
    });
  },
};
