const router = require('express').Router();

const auth = require('./controllers/auth');
const home = require('./controllers/home');
const instructor = require('./controllers/instructor');
const user = require('./controllers/user');

// Authentication
router.get('/auth/login', auth.login.show);
router.post('/auth/login', auth.login.submit);
router.get('/auth/register', auth.register.show);
router.post('/auth/register', auth.register.submit);
router.get('/auth/recovery', auth.recovery.show);
router.post('/auth/recovery', auth.recovery.submit);

// Home / Root
router.get('/', home.index);
router.get('/faq', home.faq);

// User
router.get('/user', user.index);
router.get('/user/profile', user.profile);
router.put('/user/profile', user.update);
router.get('/user/wishlist', user.wishlist.show);
router.post('/user/wishlist', user.wishlist.add);

// Instructor
router.get('/instructor', instructor.index);
router.get('/instructor/register', instructor.register.show);
router.post('/instructor/register', instructor.register.submit);
router.get('/instructor/courses/:courseId', instructor.course.detail);
router.get(
  '/instructor/courses/:courseId/content',
  instructor.course.content.show
);
router.post(
  '/instructor/courses/:courseId/content',
  instructor.course.content.submit
);
router.get('/instructor/courses/:courseId/quiz', instructor.course.quiz.show);
router.post(
  '/instructor/courses/:courseId/quiz',
  instructor.course.quiz.submit
);

module.exports = router;
