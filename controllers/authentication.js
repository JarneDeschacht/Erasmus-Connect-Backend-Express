const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const City = require('../models/city');

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const bio = req.body.bio;
        const email = req.body.email;
        const dateOfBirth = req.body.dateOfBirth;
        const zipcode = req.body.zipcode;
        const cityName = req.body.cityName;

        let [rows] = await City.getCountryByName(req.body.countryName);
        const country = rows[0];

        const city = new City(null, zipcode, cityName, country.countryId);
        [rows] = await city.save();
        city.id = rows[0].cityid;

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new User(null, firstName, lastName, bio, dateOfBirth, email, hashedPassword, city.id);

        [rows] = await newUser.save();

        const token = jwt.sign({
            email: email,
            userId: rows.insertId.toString()
        }, 'someverysecrettokenforerasmusconnect', {
            expiresIn: '1h'
        });
        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            userId: rows.insertId.toString()
        }
        );
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const [rows] = await User.findByEmail(email);
        const user = rows[0];
        if (!user) {
            const error = new Error('There is no user with these credentials!');
            error.statusCode = 401;
            throw (error);
        }

        const doPasswordsMatch = await bcrypt.compare(password, user.password);
        if (!doPasswordsMatch) {
            const error = new Error('Password is incorrect');
            error.statusCode = 401;
            throw (error);
        }

        const token = jwt.sign({
            email: user.email,
            userId: user.studentId.toString()
        }, 'someverysecrettokenforerasmusconnect', {
            expiresIn: '1h'
        });
        res.status(200).json({ token: token, userId: user.studentId.toString() });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}