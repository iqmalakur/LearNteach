const router = require('express').Router();

const auth = require('./controllers/auth');
const home = require('./controllers/home');
const user = require('./controllers/user');

// Authentication
router.get('/auth/login', auth.login.show);
router.post('/auth/login', auth.login.submit);
router.get('/auth/register', auth.register.show);
router.post('/auth/register', auth.register.submit);
router.get('/auth/recovery', auth.recovery.show);
router.post('/auth/recovery', auth.recovery.submit);

router.get('/', home.index);
router.get('/user', user.index);

module.exports = router;
