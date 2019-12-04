const User = require('../models/user');
const City = require('../models/city');
const University = require('../models/university');
const { transformUsers } = require('../util/transformations');
const {validationResult} = require('express-validator')

exports.registerErasmus = async (req, res, next) => {
    const userId = req.userId;
    try {
        const homeCourse = req.body.homeCourse;
        const homeUniversityName = req.body.homeUniversity;
        const homeCityName = req.body.homeCity;
        const homeCountryId = req.body.homeCountryId;
        const erasmusCourse = req.body.erasmusCourse;
        const erasmusUniversityName = req.body.erasmusUniversity;
        const erasmusCityName = req.body.erasmusCity;
        const erasmusCountryId = req.body.erasmusCountryId;
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path.replace("\\", "/");
        }

        const homeCity = new City(null, homeCityName, homeCountryId);
        [rows] = await homeCity.save();
        homeCity.id = rows[0].cityid;

        const homeUniversity = new University(null, homeUniversityName, homeCity.id);
        [rows] = await homeUniversity.save();
        homeUniversity.id = rows[0].uniId;

        const erasmusCity = new City(null, erasmusCityName, erasmusCountryId);
        [rows] = await erasmusCity.save();
        erasmusCity.id = rows[0].cityid;

        const erasmusUniversity = new University(null, erasmusUniversityName, erasmusCity.id);
        [rows] = await erasmusUniversity.save();
        erasmusUniversity.id = rows[0].uniId;

        await User.registerErasmus(userId, homeCourse, homeUniversity.id, erasmusCourse, erasmusUniversity.id, imageUrl);

        res.status(201).json({
            message: 'Erasmus registered successfully',
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getStudents = async (req, res, next) => {
    const userId = req.userId;
    let keyword = req.params.keyword === 'EMPTY' ? '' : req.params.keyword;
    keyword = '%' + keyword + '%';
    try {
        const [users] = await User.getAll(userId, keyword);
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
exports.editProfile = async (req, res, next) => {
    const userId = req.userId;
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
        const bio = req.body.bio;

        await User.updateProfile(userId, firstName, lastName, email, dateOfBirth, country_id, phoneNumber, bio);

        res.status(201).json({
            message: 'User profile updated successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.editErasmus = async (req, res, next) => {
    const userId = req.userId;
    try {
        const homeCourse = req.body.homeCourse;
        const homeUniversityName = req.body.homeUniversity;
        const homeCityName = req.body.homeCity;
        const homeCountryId = req.body.homeCountryId;
        const erasmusCourse = req.body.erasmusCourse;
        const erasmusUniversityName = req.body.erasmusUniversity;
        const erasmusCityName = req.body.erasmusCity;
        const erasmusCountryId = req.body.erasmusCountryId;

        const homeCity = new City(null, homeCityName, homeCountryId);
        [rows1] = await homeCity.save();
        homeCity.id = rows1[0].cityid;

        console.log(homeCity.id);

        const homeUniversity = new University(null, homeUniversityName, homeCity.id);
        [rows2] = await homeUniversity.save();
        homeUniversity.id = rows2[0].uniId;

        console.log(homeUniversity.id);

        const erasmusCity = new City(null, erasmusCityName, erasmusCountryId);
        [rows3] = await erasmusCity.save();
        erasmusCity.id = rows3[0].cityid;

        console.log(erasmusCity.id);

        const erasmusUniversity = new University(null, erasmusUniversityName, erasmusCity.id);
        [rows4] = await erasmusUniversity.save();
        erasmusUniversity.id = rows4[0].uniId;

        console.log(erasmusUniversity.id);

        await User.updateErasmus(userId, homeCourse, homeUniversity.id, erasmusCourse, erasmusUniversity.id);

        res.status(201).json({
            message: 'Erasmus updated successfully',
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

