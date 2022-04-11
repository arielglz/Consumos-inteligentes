const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getBills } =  require('../controllers/bill-controller');

router.get('/bills/:id', verifyToken, getBills);

module.exports = router;