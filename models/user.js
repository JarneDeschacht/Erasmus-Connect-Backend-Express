const db = require('../util/database');

module.exports = class User {
    constructor(id, firstName, lastName, bio, dateOfBirth, email, password, cityId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.cityId = cityId;
    }
    save() {
        return db.execute(
            `INSERT INTO student (firstName,lastName,bio,dateOfBirth,homeCourse,erasmusCourse,
                email,password,homeUniversity,erasmusUniversity,imageUrl,city_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.firstName, this.lastName, this.bio, this.dateOfBirth, null, null,
            this.email, this.password, null, null, null,this.cityId]
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