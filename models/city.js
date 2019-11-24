const db = require('../util/database');

module.exports = class City {
    constructor(id, zipCode, name, countryId) {
        this.id = id;
        this.zipCode = zipCode;
        this.name = name;
        this.countryId = countryId;
    }
    save() {
        return db.execute("CALL insert_city(?,?,?,@cityid)", [this.zipCode, this.name, this.countryId]).then(() => {
            return db.execute("SELECT @cityid AS cityid;");
        }).catch(err => console.log(err));
    }
    static getCountryByName(countryName) {
        return db.execute('SELECT * FROM country WHERE country.countryName = ?', [countryName]);
    }
    static getAllCountries() {
        return db.execute('SELECT * FROM country');
    }
}