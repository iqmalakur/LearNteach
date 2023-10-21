export const auth = {
  login: {
    show: (req, res) => {
      res.render('auth/login', {
        layout: 'layouts/main-layout',
        title: 'Login',
      });
    },
    submit: (req, res) => {
      res.send('ok');
    },
  },
  register: {
    show: (req, res) => {
      res.render('auth/register', {
        layout: 'layouts/main-layout',
        title: 'Register',
      });
    },
    submit: (req, res) => {
      res.send('ok');
    },
  },
  recovery: {
    show: (req, res) => {
      res.render('auth/recovery', {
        layout: 'layouts/main-layout',
        title: 'Forgot Password',
      });
    },
    submit: (req, res) => {
      res.send('ok');
    },
  },
};
