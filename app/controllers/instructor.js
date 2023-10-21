export const instructor = {
  index: (req, res) => {
    res.render('instructor/index', {
      layout: 'layouts/main-layout',
      title: 'Instructor - Dashboard',
    });
  },
  register: {
    show: (req, res) => {
      res.render('instructor/register', {
        layout: 'layouts/main-layout',
        title: 'Register',
      });
    },
    submit: (req, res) => {
      res.send('ok');
    },
  },
  course: {
    detail: (req, res) => {
      res.render('instructor/course', {
        layout: 'layouts/main-layout',
        title: 'Course',
      });
    },
    content: {
      show: (req, res) => {
        res.render('instructor/content', {
          layout: 'layouts/main-layout',
          title: 'Add Content',
        });
      },
      submit: (req, res) => {
        res.send('ok');
      },
    },
    quiz: {
      show: (req, res) => {
        res.render('instructor/quiz', {
          layout: 'layouts/main-layout',
          title: 'Add Quiz',
        });
      },
      submit: (req, res) => {
        res.send('ok');
      },
    },
  },
};
