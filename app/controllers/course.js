export const course = {
  index: (req, res) => {
    res.render('course/index', {
      layout: 'layouts/main-layout',
      title: 'Course List',
    });
  },
  detail: (req, res) => {
    res.render('course/detail', {
      layout: 'layouts/main-layout',
      title: 'Course Detail',
    });
  },
  instructor: (req, res) => {
    res.render('course/instructor', {
      layout: 'layouts/main-layout',
      title: 'Instructor Info',
    });
  },
};
