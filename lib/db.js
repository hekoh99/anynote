var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'rhgkdms99**',
  database : 'anynote'
});
db.connect();
module.exports = db;
