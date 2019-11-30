const express = require('express');
const userConnectionController = require('../controllers/userConnection');

const router = express.Router();

router.post('/connectToStudent', userConnectionController.connectToStudent)
router.post('/acceptConnection', userConnectionController.acceptConnection)
router.post('/refuseConnection', userConnectionController.refuseConnection)
router.get('/connectionStatus/:sender/:receiver', userConnectionController.connectionStatus)
router.get('/getConnections/:userId', userConnectionController.getConnections)


module.exports = router;