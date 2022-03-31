const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getAllConsumptions, getClientLocationConsumptionsBetweenDates, getClientDevicesConsumptionsBetweenDates, getAllDeviceConsumptionByClientID, getConsumptionByLocationID, getConsumptionsByPlugID } =  require('../controllers/consumption-controller');

router.get('/consumptions', verifyToken, getAllConsumptions);
router.get('/consumptions/location/:id', verifyToken, getConsumptionByLocationID);
router.get('/consumptions/plug/:id', verifyToken, getConsumptionsByPlugID);
router.get('/consumptions/client/:id', verifyToken, getAllDeviceConsumptionByClientID);

router.post('/consumptions/client/:id', verifyToken, getClientDevicesConsumptionsBetweenDates)
router.post('/consumptions/location/:id', verifyToken, getClientLocationConsumptionsBetweenDates)

module.exports = router;