const CommandTemplate = require(`./_Command.js`);

class Random extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);
        this.send(this.getString('ping') + ' ' + Math.floor(Math.random() * 101));
    }
}

module.exports = {
    name: `random`,
    execute(msg, args) {new Random(msg, args)}
}