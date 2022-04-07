const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getLocations, getLocationsByID, registerLocation, updateLocation, deleteLocationByID, getMyLocationsByClientID } =  require('../controllers/location-controller');

/*router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})*/

router.get('/locations', verifyToken, getLocations);
//router.get('/locations/:id', verifyToken, getLocationsByID);
router.get('/locations/client/:id', verifyToken, getMyLocationsByClientID);
router.get('/locations/:id', verifyToken, getLocationsByID)
router.post('/locations', verifyToken, registerLocation);
router.put('/locations/:id', verifyToken, updateLocation);
router.delete('/locations/:id', verifyToken, deleteLocationByID);

module.exports = router;