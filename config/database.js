const mysql =  require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_petshop'
});

connection.connect((err)=> {
    if (err) {
        console.log(err);
    } else {
        console.log("Database Terkoneksi");
    }
});

module.exports = {connection};