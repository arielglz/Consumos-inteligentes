const {Router} = require('express');
const router = Router();

const { authClient } =  require('../controllers/login-controller');

router.post('/login', authClient);

module.exports = router;