const botConfig = require(`../config/config.json`);
const mariadb = require('mariadb');

const pool = mariadb.createPool(botConfig.dbPass);
pool.getConnection()
	.then(conn => {
		console.log("Connected with MariaDB!");
		conn.release();
	})
	.catch(err => {
		console.log("Not connected due to error: " + err);
	});

async function _query(query, values = null) {
	let conn;
	let rows;
	try {
		conn = await pool.getConnection();
		rows = await conn.query(query, values);
	} catch (err) {
		throw err;
	} finally {
		if (conn) {
			conn.end()
			return rows;
		}
	}
}

module.exports = {
	async query(query, values = null) {return _query(query, values)}
}