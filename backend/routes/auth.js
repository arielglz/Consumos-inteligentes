const {Router} = require('express');
const router = Router();

const { authClient } =  require('../controllers/login-controller');
/*
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
})
*/
router.post('/login', authClient);

module.exports = router;