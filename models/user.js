const db = require('../util/database');
const sqlDateConvert = require('../util/sqlDateConvert')
module.exports = class User {
    constructor(id, firstName, lastName, phonenumber, dateOfBirth, email, password, country_id) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = "Add your personal bio!";
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.country_id = country_id;
        this.phoneNumber = phonenumber;
    }
    save() {
        return db.execute(
            `INSERT INTO student (firstName,lastName,bio,dateOfBirth,homeCourse,erasmusCourse,
                email,password,homeUniversity,erasmusUniversity,imageUrl,country_id,phoneNumber, changePasswordExpiration)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.firstName, this.lastName, this.bio, this.dateOfBirth, null, null,
            this.email, this.password, null, null, null, this.country_id, this.phoneNumber, null]
        );
    }
    static setPasswordChangeExpiration(id) {
        const sqlDateTime = sqlDateConvert(new Date());

        return db.execute(`
            UPDATE student
            SET changePasswordExpiration = ?
            WHERE studentId = ?`, [sqlDateTime, id]);
    }

    static removePasswordExpiration(id) {
        return db.execute(`
            UPDATE student
            SET changePasswordExpiration = null
            WHERE studentId = ?`, [id]);
    }

    static setNewPassword(id, newPassword) {
        return db.execute(`
            UPDATE student
            SET password = ?
            WHERE studentId = ?`, [newPassword, id]);
    }

    static findById(id) {
        return db.execute(`
            SELECT * FROM student
            JOIN country ON country_id = country.countryId
            WHERE studentId = ?`, [id]);
    }

    static findByEmail(email) {
        return db.execute('SELECT * FROM student WHERE student.email = ?', [email]);
    }

    //get all students except the logged in one
    static getAll(id, keyword) {
        return db.execute(`
        SELECT * FROM student
        JOIN country ON country_id = country.countryId
        JOIN university on erasmusUniversity = university.universityId
        JOIN city on city.cityId = university.city_id
        JOIN country as erasmusCountry on erasmusCountry.countryId = city.country_id
        WHERE studentId <> ? AND (
            firstName LIKE ?
            OR lastName LIKE ?
            OR erasmusCountry.countryName LIKE ?
            OR city.cityName LIKE ?
            OR university.name LIKE ? )
            `, [id, keyword, keyword, keyword, keyword, keyword]);
    }
    static registerErasmus(userId, homeCourse, homeUniversityId, erasmusCourse, erasmusUniversityId, imageUrl) {
        return db.execute(`
            UPDATE student
            SET homeCourse = ?,
                erasmusCourse = ?,
                homeUniversity = ?,
                erasmusUniversity = ?,
                imageUrl = ?
            WHERE studentId = ?
        `, [homeCourse, erasmusCourse, homeUniversityId, erasmusUniversityId, imageUrl, userId])
    }
    static updateProfile(userId, firstName, lastname, email, dateOfBirth, countryId, phoneNumber, bio) {
        return db.execute(`
            UPDATE student
            SET firstName = ?,
                lastName = ?,
                email = ?,
                dateOfBirth = ?,
                country_id = ?,
                phoneNumber = ?,
                bio = ?
            WHERE studentId = ?
        `, [firstName, lastname, email, dateOfBirth, countryId, phoneNumber, bio, userId])
    }
    static updateErasmus(userId, homeCourse, homeUniversityId, erasmusCourse, erasmusUniversityId) {
        return db.execute(`
            UPDATE student
            SET homeCourse = ?,
                erasmusCourse = ?,
                homeUniversity = ?,
                erasmusUniversity = ?
            WHERE studentId = ?
    `, [homeCourse, erasmusCourse, homeUniversityId, erasmusUniversityId, userId])
    }


}