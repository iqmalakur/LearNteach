module.exports = {
  index: (req, res) => {
    res.render('user/index', { title: 'Dashboard' });
  },
  profile: (req, res) => {
    res.render('user/profile', { title: 'My Profile' });
  },
  update: (req, res) => {
    res.send('ok');
  },
  wishlist: {
    show: (req, res) => {
      res.render('user/wishlist', { title: 'Wishlist' });
    },
    add: (req, res) => {
      res.send('ok');
    },
  },
};
