const router = require('express').Router();

const home = require('./controllers/home');
const user = require('./controllers/user');

router.get('/', home.index);
router.get('/user', user.index);

module.exports = router;
