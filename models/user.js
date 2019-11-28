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
                email,password,homeUniversity,erasmusUniversity,imageUrl,country_id,phoneNumber, changePasswordExpiration)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [this.firstName, this.lastName, this.bio, this.dateOfBirth, null, null,
            this.email, this.password, null, null, null, this.country_id, this.phoneNumber, null]
        );
    }
    static setPasswordChangeExpiration(id) {
        const currentDate = new Date();
        const sqlDateTime = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()} ${currentDate.getHours() + 1}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`

        return db.execute(`
            UPDATE student
            SET changePasswordExpiration = ?
            WHERE studentId = ?`, [sqlDateTime, id]);
    }

    static removePasswordExpiration(id) {
        return db.execute(`
        DELETE FROM student
        WHERE studentId = ?`, [id])
    }

    static setNewPassword(id, newPassword) {
        console.log(id)
        console.log(newPassword)
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

    //get all students except the loged in one
    static getAll(id) {
        return db.execute(`
            SELECT * FROM student
            JOIN country ON country_id = country.countryId
            WHERE studentId <> ?
            `, [id]);
    }
}