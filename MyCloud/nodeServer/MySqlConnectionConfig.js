const mysql = require('mysql');
module.exports = function() {
	const conn = mysql.createPool({host:'localhost',user:'root',password:'password',database:'MyCloud',multipleStatements:true});
	return conn;
}

