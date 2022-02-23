const {Router} = require('express');
const router = Router();

const { getClients, getClientById, registerClient, updateClientById, deleteClientById } =  require('../controllers/client-controller');

router.get('/clients', getClients);
router.get('/clients/:id', getClientById);
router.post('/clients', registerClient);
router.put('/clients/:id', updateClientById);
router.delete('/clients/:id', deleteClientById);

module.exports = router;