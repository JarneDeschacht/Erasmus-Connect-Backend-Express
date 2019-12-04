const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

router.get('/my-profile', isAuth, userController.getLoggedInUser);
router.get('/students/:keyword', isAuth, userController.getStudents);
router.get('/student/:studentId', isAuth, userController.getStudent);
router.post('/register-erasmus', [
], isAuth, userController.registerErasmus);
router.get('/countries', userController.getCountries);
router.patch('/register-erasmus', isAuth, userController.registerErasmus);
router.patch('/edit-profile', [
    body('firstName').trim().isLength({ min: 1, max: 100 }).withMessage('Firstname is required and may not contain more than 100 characters'),
    body('lastName').trim().isLength({ min: 1, max: 100 }).withMessage('lastName is required and may not contain more than 100 characters'),
    body('phoneNumber').trim().isLength({ min: 1, max: 100 }).withMessage('Phone number is required and may not contain more than 100 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('bio').trim().isLength({ min: 1, max: 5000 }).withMessage('Bio is required and must be between 1 and 5000 characters'),
    body('countryId').not().isEmpty().isInt().withMessage('Country id is required and must be a number')
], isAuth, userController.editProfile);
router.patch('/edit-erasmus', isAuth, userController.editErasmus);

module.exports = router;