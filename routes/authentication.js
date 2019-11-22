const express = require('express');
const authController = require('../controllers/authentication');
const { body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

router.put('/signup', [
    body('firstName').trim().isLength({ min: 1, max: 100 }).withMessage('Firstname is required and may not contain more than 100 characters'),
    body('lastName').trim().isLength({ min: 1, max: 100 }).withMessage('lastName is required and may not contain more than 100 characters'),
    body('bio').trim().isLength({ min: 1, max: 5000 }).withMessage('Bio is required and may not contain more than 5000 characters'),
    body('email').isEmail().withMessage('Please enter a valid email').custom((value, { req }) => {
        return User.findByEmail(value).then(([rows]) => {
            if (rows[0]) {
                return Promise.reject('There is already a user with this email!');
            }
        })
    }),
    body('password').trim().isLength({ min: 8, max: 100 }).withMessage('Password is required and must be between 8 and 100 characters'),
    body('zipcode').not().isEmpty().isInt().withMessage('Zipcode is required and must be a number'),
    body('cityName').trim().isLength({ min: 1, max: 100 }).withMessage('CityName is required and may not contain more than 100 characters'),
    body('countryName').trim().isLength({ min: 1, max: 100 }).withMessage('CountryName is required and may not contain more than 100 characters'),
], authController.signup);

router.post('/login', authController.login);

module.exports = router;