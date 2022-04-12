const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getBills, getClientsConsumptionBills } =  require('../controllers/bill-controller');

router.get('/bills/:id', verifyToken, getBills);
router.post('/bills/create', getClientsConsumptionBills);

module.exports = router;