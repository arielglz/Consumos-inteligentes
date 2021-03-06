const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getDevices, getDevicesByID, registerDevice, updateDevice, deleteDeviceByID, getDevicesByPlugID, getDevicesByClientID } =  require('../controllers/devices-controller');

router.get('/devices/', verifyToken, getDevices);
//router.get('/devices/:id', verifyToken, getDevicesByID);
router.get('/devices/plug/:id', verifyToken, getDevicesByPlugID);
router.get('/devices/:id', verifyToken, getDevicesByID);
router.get('/devices/client/:id', verifyToken, getDevicesByClientID)
router.post('/devices', verifyToken, registerDevice);
router.put('/devices/:id', verifyToken, updateDevice);
router.delete('/devices/:id', verifyToken, deleteDeviceByID);

module.exports = router;