const mysql = require('mysql2');


const pool = mysql.createPool({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7313407',
    password: 'MJ1iTPx2vr',
    database: 'sql7313407'
});

module.exports = pool.promise();