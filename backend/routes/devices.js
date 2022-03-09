const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getDevices, getDevicesByID, registerDevice, updateDevice, deleteDeviceByID, getDevicesByPlugID } =  require('../controllers/devices-controller');

router.get('/devices', verifyToken, getDevices);
//router.get('/devices/:id', verifyToken, getDevicesByID);
router.get('/devices/:id', verifyToken, getDevicesByPlugID);
router.post('/devices', verifyToken, registerDevice);
router.put('/devices/:id', verifyToken, updateDevice);
router.delete('/clients/:id', verifyToken, deleteDeviceByID);

module.exports = router;