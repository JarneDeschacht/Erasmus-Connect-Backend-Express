exports.transformUsers = (users) => {
    return users.map((user) => {
        return {
            id: user.studentId,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            dateOfBirth: user.dateOfBirth,
            imageUrl: user.imageUrl,
            city: {
                id: user.cityId,
                name: user.cityName,
                zipcode: user.cityZipcode,
                country: {
                    id: user.countryId,
                    name: user.countryName,
                    code: user.countryCode
                }
            },
            homeCourse: user.homeCourse,
            erasmusCourse: user.erasmusCourse,
            homeUniversity: { ...user.homeUniversity },
            erasmusUniversity: { ...user.erasmusUniversity }
        }
    })
}