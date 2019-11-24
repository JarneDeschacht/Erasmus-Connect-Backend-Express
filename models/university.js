const db = require('../util/database');

module.exports = class University {
    constructor() {

    }
    save() {

    }
    static getById(id) {
        return db.execute(`
            SELECT * FROM university
            JOIN city on city.cityId = university.city_id
            JOIN country on country.countryId = city.country_id
            WHERE university.universityId = ?
        `, [id]);
    }
}