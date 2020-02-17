const EventEmitter = require('events');
const Discord = require(`discord.js`);
var _client = new Discord.Client();

class ClientEmiter extends EventEmitter {}
const _clientEmiter = new ClientEmiter();

module.exports = {client: _client, clientEmiter: _clientEmiter};
