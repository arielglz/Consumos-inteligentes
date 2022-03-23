const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getPlugs, getPlugsByLocationID, getPlugByID, updatePlug, getPlugByClientID, registerPlug, deletePlugByID } =  require('../controllers/plug-controller');

router.get('/plugs', verifyToken, getPlugs);
//router.get('/devices/:id', verifyToken, getDevicesByID);
router.get('/plugs/location/:id', verifyToken, getPlugsByLocationID);
router.get('/plugs/client/:id', verifyToken, getPlugByClientID);
router.get('/plugs/:id', verifyToken, getPlugByID);
router.post('/plugs', verifyToken, registerPlug);
router.put('/plugs/:id', verifyToken, updatePlug);
router.delete('/plugs/:id', verifyToken, deletePlugByID);

module.exports = router;