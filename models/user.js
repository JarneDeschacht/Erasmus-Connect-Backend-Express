const db = require('../util/database');

module.exports = class User {
    constructor(id, firstName, lastName, bio, dateOfBirth, homeCourse, erasmusCourse,
        email, password, homeUniversity, erasmusUniversity, homeCityId, ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.dateOfBirth = dateOfBirth;
        this.homeCourse = homeCourse;
        this.erasmusCourse = erasmusCourse;
        this.email = email;
        this.password = password;
        this.homeUniversity = homeUniversity;
        this.erasmusUniversity = erasmusUniversity;
        this.homeCityId = homeCityId;
    }
    save() {
        return db.execute(
            `INSERT INTO student (firstName,lastName,bio,dateOfBirth,homeCourse,erasmusCourse,
                email,password,homeUniversity,erasmusUniversity,city_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.firstName, this.lastName, this.bio, this.dateOfBirth, this.homeCourse, this.erasmusCourse,
            this.email, this.password, this.homeUniversity, this.erasmusUniversity, this.homeCityId]
        );
    }
    static findById(id) {
        return db.execute(`
            SELECT * FROM student
            JOIN city ON city_id = city.cityId
            JOIN country ON country_id = country.countryId
            WHERE studentId = ?`, [id]);
    }
    static findByEmail(email) {
        return db.execute('SELECT * FROM student WHERE student.email = ?', [email]);
    }
    static getAll(id) {
        return db.execute(`
            SELECT * FROM student
            JOIN city ON city_id = city.cityId
            JOIN country ON country_id = country.countryId
            WHERE studentId <> ?
            `, [id]);
    }
}