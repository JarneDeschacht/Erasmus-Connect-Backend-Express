const db = require('../util/database');

module.exports = class University {
    constructor(id, name, cityId) {
        this.id = id;
        this.name = name;
        this.cityId = cityId;
    }
    save() {
        return db.execute("CALL insert_university(?,?,@uniId)", [this.name, this.cityId]).then(() => {
            return db.execute("SELECT @uniId AS uniId");
        }).catch(err => console.log(err));
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