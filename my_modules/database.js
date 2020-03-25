const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const botConfig = require(`../config/config.json`);
const mariadb = require('mariadb');

/*
	Task type
	0 - Mute
*/

class Database {
	constructor() {
		this.pool = mariadb.createPool(botConfig.dbPass);

		this.pool.getConnection().then(conn => {
			console.log("Connected with MariaDB!");
			conn.release();
		}).catch(err => {
			console.log("Not connected due to error: " + err);
		});

		setInterval(this.checkTasks, 10000, this.query, this.pool);
	}
	async query(query, values = null, p = null) {
		let conn;
		let rows;
		try {
			conn = (p ? await p.getConnection() : await this.pool.getConnection());
			rows = await conn.query(query, values);
		} catch (err) {
			throw err;
		} finally {
			if (conn) {
				conn.end();
				return rows;
			}
		}
	}
	async checkTasks(query, poll) {
		const tasksResult = await query("SELECT * FROM `timeTasks` WHERE `executionTime` <= ?", [(new Date()).getTime()], poll);
		if (!tasksResult) return;

		tasksResult.forEach(task => {
			if (task.taskType == 0) clientEmiter.emit(`takExecuteMute`, task);
			query("DELETE FROM `timeTasks` WHERE `id` = ?", [task.id], poll);
		})
	}
}

const db = new Database();

module.exports = {db}