const db = require('../util/database');

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
                email,password,homeUniversity,erasmusUniversity,imageUrl,country_id,phoneNumber)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.firstName, this.lastName, this.bio, this.dateOfBirth, null, null,
            this.email, this.password, null, null, null, this.country_id, this.phoneNumber]
        );
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
    static getAll(id) {
        return db.execute(`
            SELECT * FROM student
            JOIN country ON country_id = country.countryId
            WHERE studentId <> ?
            `, [id]);
    }
}