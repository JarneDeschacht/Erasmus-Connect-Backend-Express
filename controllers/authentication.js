const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const transporter = require('../util/transporter');

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
        const email = req.body.email;
        const dateOfBirth = req.body.dateOfBirth;
        const country_id = req.body.countryId;
        const phoneNumber = req.body.phoneNumber;

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new User(null, firstName, lastName, phoneNumber, dateOfBirth, email, hashedPassword, country_id);

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

exports.forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email
        const [rows] = await User.findByEmail(email);
        const user = rows[0];

        if (!user) {
            const error = new Error('There is no account with this email.');
            throw (error);
        }

        console.log('authentication controller before')
        await User.setPasswordChangeExpiration(user.studentId)

        console.log('authentication controller before')

        
        await transporter.sendMail({
            to: email,
            from: 'esn-connect@erasmus.com',
            subject: 'reset password',
            html: `
            <p>
                You have requested to change your password. <br/>
                click on the folowing link and pick a new password. <br/>

                <a href="http://localhost:3000/forgotPassword/${user.userId}"> click here to reset password </a>
            </p>
            `
        })

        res.status(200).json({
            message: 'expiration date for changing password has been set',
        });
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.setNewPassword = async (req, res, next) => {
    try {
        const studentId = req.body.studentId
        const newPassword = req.body.newPassword
        const encryptedPassword = await bcrypt.hash(newPassword, 12)

        //checken timestamp
        const [rows] = await User.findById(studentId)
        const user = rows[0]
        const expiryDate = user.changePasswordExpiration
        const currentDate = new Date()

        if (currentDate.getTime() > expiryDate.getTime()) {
            const error = new Error('expiration time for changing password expired');
            throw (error);
        }

        //verwijderen van timestamp als het werkt
        await User.removePasswordExpiration(studentId);


        await User.setNewPassword(studentId, encryptedPassword)


        res.status(200).json({
            message: 'password was updated',
        });
    }

    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}