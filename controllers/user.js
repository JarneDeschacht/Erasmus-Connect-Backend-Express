const User = require('../models/user');
const City = require('../models/city');
const { transformUsers } = require('../util/transformations');

exports.registerErasmus = async (req, res, next) => {

}

exports.getStudents = async (req, res, next) => {
    const userId = req.userId;
    try {
        const [users] = await User.getAll(userId);
        if (!users) {
            const error = new Error('No users found');
            error.statusCode = 401;
            throw (error);
        }
        res.status(200).json({
            message: 'Users fetched succesfully',
            users: await transformUsers([...users])
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getStudent = async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        res.status(200).json({
            message: 'User fetched succesfully',
            user: (await transformUsers([await fetchStudent(studentId)]))[0]
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getLoggedInUser = async (req, res, next) => {
    const userId = req.userId;
    try {
        res.status(200).json({
            message: 'Profile fetched succesfully',
            user: (await transformUsers([await fetchStudent(userId)]))[0]
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCountries = async (req, res, next) => {
    try {
        const [rows] = await City.getAllCountries();
        res.status(200).json({
            message: 'Countries fetched succesfully',
            countries: rows.map(country => {
                return {
                    id: country.countryId,
                    code: country.countryCode,
                    name: country.countryName
                }
            })
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const fetchStudent = async (id) => {
    const [rows] = await User.findById(id);
    const user = rows[0];
    if (!user) {
        const error = new Error('There is no user with this id!');
        error.statusCode = 401;
        throw (error);
    }
    return user;
}