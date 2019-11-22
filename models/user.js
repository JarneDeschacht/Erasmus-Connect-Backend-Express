const db = require('../util/database');

module.exports = class User {
    constructor(id, firstName, lastName, bio, dateOfBirth, course, email, password, homeUniversity, erasmusUniversity, homeCityId, ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.dateOfBirth = dateOfBirth;
        this.course = course;
        this.email = email;
        this.password = password;
        this.homeUniversity = homeUniversity;
        this.erasmusUniversity = erasmusUniversity;
        this.homeCityId = homeCityId;
    }
    save() {
        return db.execute(
            `INSERT INTO student (firstName,lastName,bio,dateOfBirth,course,email,password,homeUniversity,erasmusUniversity,city_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.firstName, this.lastName, this.bio, this.dateOfBirth, this.course,
            this.email, this.password, this.homeUniversity, this.erasmusUniversity, this.homeCityId]
        );
    }
    static findById(id) {
        return db.execute('SELECT * FROM student WHERE student.id = ?', [id]);
    }
    static findByEmail(email) {
        return db.execute('SELECT * FROM student WHERE student.email = ?', [email]);
    }
}