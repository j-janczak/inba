const {client, clientEmiter}  = require(`../my_modules/discordClient.js`);
const EventEmitter = require('events');
const mysql = require(`mysql`);

class ServerEvents extends EventEmitter {}
const _serverEvents = new ServerEvents();

var _db = mysql.createPool({
	connectionLimit : 10,
	host: `185.238.72.95`,
	user: `root`,
	password: `CrMnUaL45s`,
	database: `mrinba`,
	charset : 'utf8mb4'
});

_db.getConnection((err, connection) => {
	if (err) throw err;
	else console.log(`Connected with the database 🛰`.gray);
	setInterval(() => {pingToDB()}, 10000);
	connection.release();
});

function _query(q, v, callback) {
	_db.getConnection((err, connection) => {
		if (err) {
			if (err.code === 'PROTOCOL_CONNECTION_LOST') console.error('Database connection was closed.');
			if (err.code === 'ER_CON_COUNT_ERROR') console.error('Database has too many connections.');
			if (err.code === 'ECONNREFUSED') console.error('Database connection was refused.');
			else {
				console.error('Database error');
				throw err;
			}
		}
		if (connection) {
			connection.query(mysql.format(q, v), (err, result) => {
				if (err) throw err;
				else if (callback) callback(result);
			});
		}
		connection.release();
	});
}

function pingToDB() {
	let timeNow = (new Date()).getTime();
	_query("SELECT * FROM `mrinba`.`activeTasks` WHERE endTimeStamp < ?", [timeNow], result => {
		result.forEach(task => {
			let server = client.guilds.find(s => s.id == task[`serverFK`]);
			let member = server.members.find(m => m.id == task[`userFK`]);
			if (task[`taskFK`] == 0) _serverEvents.emit(`pollTimesUp`, server, member, task);
			else if (task[`taskFK`] == 1) _serverEvents.emit(`removeRole`, server, member, task[`taskData`]);

			_query("DELETE FROM `mrinba`.`activeTasks` WHERE activeTaskID = ?", [task[`activeTaskID`]]);
		});
	});
}

module.exports = {
	serverEvents: _serverEvents,
	query(q, v, callback) {_query(q, v, callback);}
};

