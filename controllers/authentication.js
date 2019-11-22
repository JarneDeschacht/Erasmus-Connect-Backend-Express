const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res, next) => {

}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const [rows, fieldData] = await User.findByEmail(email);
        const user = rows[0];
        if (!user) {
            const error = new Error('There is no user with this email!');
            error.statusCode = 401;
            throw (error);
        }
        // const doPasswordsMatch = await bcrypt.compare(password, user.password);
        const doPasswordsMatch = password === user.password;
        if (!doPasswordsMatch) {
            const error = new Error('Password is incorrect');
            error.statusCode = 401;
            throw (error);
        }

        const token = jwt.sign({
            email: user.email,
            userId: user.id.toString()
        }, 'someverysecrettokenforerasmusconnect', {
            expiresIn: '1h'
        });
        res.status(200).json({ token: token, userId: user.id.toString() });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}