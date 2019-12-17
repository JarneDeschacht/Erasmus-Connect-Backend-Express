const db = require('../util/database');

module.exports = class City {
    constructor(id,name, countryId) {
        this.id = id
        this.name = name;
        this.countryId = countryId;
    }
    save() {
        return db.execute("CALL insert_city(?,?,@cityid)", [this.name, this.countryId]).then(() => {
            return db.execute("SELECT @cityid AS cityid;");
        }).catch(err => console.log(err));
    }
    static getCountryByName(countryName) {
        return db.execute('SELECT * FROM country WHERE country.countryName = ?', [countryName]);
    }
    static getAllCountries() {
        return db.execute('SELECT * FROM country ORDER BY countryName');
    }
    static getCityByName(name){
        return db.execute(`
            SELECT * FROM city
            WHERE cityName = ?;
        `,[name])
    }

    static getCityById(id){
        return db.execute(`
            select * from city
            where cityId = ,
        `,[id])
    }

    static addCity(name, countryId){
        db.execute(`
            insert into city (cityName, country_id)
            values(?, ?);
        `,[name, countryId])
    }
}