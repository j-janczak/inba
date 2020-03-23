const CommandTemplate = require(`../my_modules/CommandTemplate.js`);

class Mute extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args)
        
    }
}

module.exports = {
    name: `mute`,
    execute(msg, args) {new Mute(msg, args)}
}