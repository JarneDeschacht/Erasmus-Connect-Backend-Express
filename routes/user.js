const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/my-profile', isAuth, userController.getLoggedInUser);
router.get('/students', isAuth, userController.getStudents);
router.get('/student/:studentId', isAuth, userController.getStudent);
router.post('/register-erasmus', [
], isAuth, userController.registerErasmus);
router.get('/countries', userController.getCountries);
router.patch('/register-erasmus', isAuth, userController.registerErasmus);
router.get('/countries', userController.getCountries);
router.post('/connectToStudent', userController.connectToStudent)
router.post('/acceptConnection', userController.acceptConnection)
router.post('/refuseConnection', userController.refuseConnection)
router.get('/connectionStatus/:sender/:receiver', userController.connectionStatus)
router.get('/getConnections/:userId', userController.getConnections)

module.exports = router;