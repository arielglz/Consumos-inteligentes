const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getPlugs, getPlugsByLocationID, registerPlug, deletePlugByID } =  require('../controllers/plug-controller');

router.get('/plugs', verifyToken, getPlugs);
//router.get('/devices/:id', verifyToken, getDevicesByID);
router.get('/plugs/:id', verifyToken, getPlugsByLocationID);
router.post('/plugs', verifyToken, registerPlug);
//router.put('/devices/:id', verifyToken, updateDevice);
router.delete('/plugs/:id', verifyToken, deletePlugByID);

module.exports = router;