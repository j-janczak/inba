const CommandTemplate = require(`./_Command.js`);

class Random extends CommandTemplate {
    constructor(msg, args, client) {
        super(msg, args, client);
        this.send(this.getString('ping') + ' ' + Math.floor(Math.random() * 101));
    }
}

module.exports = {
    name: `random`,
    execute(msg, args, client) {new Random(msg, args, client)}
}