module.exports = {
  login: {
    show: (req, res) => {
      res.render('auth/login', { title: 'Login' });
    },
    submit: (req, res) => {
      res.send('ok');
    },
  },
  register: {
    show: (req, res) => {
      res.render('auth/register', { title: 'Register' });
    },
    submit: (req, res) => {
      res.send('ok');
    },
  },
  recovery: {
    show: (req, res) => {
      res.render('auth/recovery', { title: 'Forgot Password' });
    },
    submit: (req, res) => {
      res.send('ok');
    },
  },
};
