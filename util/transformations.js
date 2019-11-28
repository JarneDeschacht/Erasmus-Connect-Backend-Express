const University = require('../models/university');

exports.transformUsers = async (users) => {
    const promises = users.map(async user => {
        const [homeUniversity] = await University.getById(user.homeUniversity);
        const [erasmusUniversity] = await University.getById(user.erasmusUniversity);
        return await {
            id: user.studentId,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            bio: user.bio,
            dateOfBirth: user.dateOfBirth,
            imageUrl: user.imageUrl,
            country: {
                id: user.countryId,
                name: user.countryName,
                code: user.countryCode
            },
            homeCourse: user.homeCourse,
            erasmusCourse: user.erasmusCourse,
            homeUniversity: homeUniversity.length ? {
                id: homeUniversity[0].universityId,
                name: homeUniversity[0].name,
                city: {
                    id: homeUniversity[0].cityId,
                    name: homeUniversity[0].cityName,
                    zipcode: homeUniversity[0].cityZipcode,
                    country: {
                        id: homeUniversity[0].countryId,
                        name: homeUniversity[0].countryName,
                        code: homeUniversity[0].countryCode
                    }
                }
            } : { city: { country: {} } },
            erasmusUniversity: erasmusUniversity.length ? {
                id: erasmusUniversity[0].universityId,
                name: erasmusUniversity[0].name,
                city: {
                    id: erasmusUniversity[0].cityId,
                    name: erasmusUniversity[0].cityName,
                    zipcode: erasmusUniversity[0].cityZipcode,
                    country: {
                        id: erasmusUniversity[0].countryId,
                        name: erasmusUniversity[0].countryName,
                        code: erasmusUniversity[0].countryCode
                    }
                }
            } : { city: { country: {} } },
        }
    })
    return await Promise.all(promises);
}