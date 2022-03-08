const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getAllConsumptions, getConsumptionByLocationID, getConsumptionsByPlugID } =  require('../controllers/consumption-controller');

router.get('/consumptions', verifyToken, getAllConsumptions);
router.get('/consumptions/location/:id', verifyToken, getConsumptionByLocationID);
router.get('/consumptions/plug/:id', verifyToken, getConsumptionsByPlugID);

module.exports = router;