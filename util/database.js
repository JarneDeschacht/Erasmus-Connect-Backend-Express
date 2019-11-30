const mysql = require('mysql2');


const pool = mysql.createPool({
    host: '34.76.128.41',
    user: 'erasmusConnectAdmin',
    password: 'r%UA93nu3#S4',
    database: 'ErasmusConnect'
});

module.exports = pool.promise();