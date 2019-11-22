const db = require('../util/database');

module.exports = class User {
    constructor(/*TODO*/) {
        //TODO
    }
    static findById(id) {
        return db.execute('SELECT * FROM student WHERE student.id = ?', [id]);
    }
    static findByEmail(email) {
        return db.execute('SELECT * FROM student WHERE student.email = ?', [email]);
    }
}