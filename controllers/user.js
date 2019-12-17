const User = require('../models/user');
const City = require('../models/city');
const University = require('../models/university');
const { transformUsers } = require('../util/transformations');
const { validationResult } = require('express-validator')

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

exports.uploadProfilePicture = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path.replace("\\", "/");
        }

        await User.updateProfilePicture(userId, imageUrl);

        res.status(201).json({
            message: 'Picture was uploaded',
        });
    }
    catch (err) {

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

        let homeCityFound = false;
        let homeUniFound = false;
        let erCityFound = false;
        let erUniFound = false;

        console.log('1')
        let homeCity = null;
        while (homeCityFound === false) {
            const [cityByName] = await City.getCityByName(homeCityName);

            if (cityByName[0] === null || cityByName[0] === undefined) {
                console.log('home city did not exist yet, lets creat it')

                await City.addCity(homeCityName, homeCountryId);

                while (homeCity === null || homeCity === undefined) {
                    const [rows1] = await City.getCityByName(homeCityName);
                    homeCity = rows1[0];
                }
            }
            else {
                homeCity = cityByName[0]
            }

            console.log(homeCity)

            if (homeCity.cityId !== null || homeCity.cityId !== undefined) {
                homeCityFound = true;
            }
        }

        console.log('2')

        let homeUniversity = null;
        while (homeUniFound === false) {
            const [unyByName] = await University.getByName(homeUniversityName)

            if (unyByName[0] === null || unyByName[0] === undefined) {
                console.log('home university did not exist yet, lets creat it')

                await University.addUniversity(homeUniversityName, homeCity.cityId);

                while (homeUniversity === null || homeUniversity === undefined) {
                    const [rows2] = await University.getByName(homeUniversityName)
                    homeUniversity = rows2[0]
                }
            }
            else {
                homeUniversity = unyByName[0]
            }

            console.log(homeUniversity)

            if (homeUniversity.universityId != null || homeUniversity.universityId != undefined) {
                homeUniFound = true;
            }
        }

        console.log('3')
        let erasmusCity = null;
        while (erCityFound === false) {
            const [cityByName] = await City.getCityByName(erasmusCityName);

            if (cityByName[0] === null || cityByName[0] === undefined) {
                console.log('erasmus city did not exist yet, lets creat it')

                await City.addCity(erasmusCityName, erasmusCountryId);

                while (erasmusCity === null || erasmusCity === undefined) {
                    const [rows3] = await City.getCityByName(erasmusCityName);
                    erasmusCity = rows3[0];
                }
            }
            else {
                erasmusCity = cityByName[0]
            }

            if (erasmusCity.cityId != null || erasmusCity.cityId != undefined) {
                erCityFound = true;
            }
        }

        console.log('4')

        let erasmusUniversity = null;
        while (erUniFound === false) {
            const [unyByName] = await University.getByName(erasmusUniversityName)

            if (unyByName[0] === null || unyByName[0] === undefined) {
                console.log('home university did not exist yet, lets creat it')

                await University.addUniversity(erasmusUniversityName, erasmusCity.cityId);
                while (erasmusUniversity === null || erasmusUniversity === undefined) {
                    const [rows4] = await University.getByName(erasmusUniversityName)
                    erasmusUniversity = rows4[0]
                }
            }
            else{
                erasmusUniversity = unyByName[0]
            }

            if (erasmusUniversity.universityId != null || erasmusUniversity.universityId != undefined) {
                erUniFound = true;
            }
        }


        console.log('5');

        console.log(userId)
        console.log(homeCourse)
        console.log(homeUniversity.universityId)
        console.log(erasmusCourse)
        console.log(erasmusUniversity.universityId)
        await User.updateErasmus(userId, homeCourse, homeUniversity.universityId, erasmusCourse, erasmusUniversity.universityId);


        const [user] = await User.findById(userId)

        res.status(201).json({
            message: 'Erasmus updated successfully',
            user: transformUsers([user[0]])
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


