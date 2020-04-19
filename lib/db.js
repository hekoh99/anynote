var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'passwords',
  database : 'anynoteDB'
});
db.connect();
module.exports = db;
