const {Router} = require('express');
const verifyToken = require('../middlewares/validate-token');
const router = Router();

const { getClients, getClientById, registerClient, updateClientById, deleteClientById, getClientByEmail } =  require('../controllers/client-controller');

router.get('/clients', verifyToken, getClients);
//router.get('/clients/:id', getClientById);
router.get('/clients/:email', getClientByEmail)
router.post('/clients', registerClient);
router.put('/clients/:id', updateClientById);
router.delete('/clients/:id', deleteClientById);

module.exports = router;