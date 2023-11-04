module.exports = {
  index: (req, res) => {
    res.render('user/index', {
      layout: 'layouts/raw-layout',
      title: 'Dashboard',
    });
  },
  profile: (req, res) => {
    res.render('user/profile', {
      layout: 'layouts/main-layout',
      title: 'My Profile',
    });
  },
  update: (req, res) => {
    res.send('ok');
  },
  wishlist: {
    show: (req, res) => {
      res.render('user/wishlist', {
        layout: 'layouts/main-layout',
        title: 'Wishlist',
      });
    },
    add: (req, res) => {
      res.send('ok');
    },
  },
};
