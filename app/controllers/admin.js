module.exports = {
  index: (req, res) => {
    res.render('admin/index', {
      layout: 'layouts/raw-layout',
      title: 'Dashboard',
    });
  },
  login: (req, res) => {
    res.render('admin/login', {
      layout: 'layouts/main-layout',
      title: 'Login',
    });
  },
  content: (req, res) => {
    res.render('admin/content', {
      layout: 'layouts/main-layout',
      title: 'Content List',
    });
  },
  user: (req, res) => {
    res.render('admin/user', {
      layout: 'layouts/main-layout',
      title: 'User List',
    });
  },
  instructor: {
    list: (req, res) => {
      res.render('admin/instructor-registration', {
        layout: 'layouts/main-layout',
        title: 'Instructor Registration',
      });
    },
    detail: (req, res) => {
      res.render('admin/instructor-document', {
        layout: 'layouts/main-layout',
        title: 'Instructor Document',
      });
    },
  },
};
