const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/my-profile', isAuth, userController.getLoggedInUser);
router.get('/students', isAuth, userController.getStudents);
router.get('/student/:studentId', isAuth, userController.getStudent);
router.patch('/register-erasmus', isAuth, userController.registerErasmus);
router.get('/countries',userController.getCountries);
router.post('/connectToStudent', userController.connectToStudent)
router.post('/acceptConnection', userController.acceptConnection)

module.exports = router;