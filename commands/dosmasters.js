const CommandTemplate = require(`../my_modules/CommandTemplate.js`);

class DosMasters extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        const action = this.args[0].toLowerCase();
        if (action == `autoit`) this.send(`posysa`);
        else if (action == `kris`) this.send(`to kryptogej`);
        else if (action == `mihaszek` || action == `mihaszki`) this.send(`dupa wychodzi z niej kupa`);
        else if (action == `alex`) this.send(`Izrael powinien przejąć tereny należące do Palestyny.`);
        else if (action == `mssc`) this.send(`kiedy beta dmbe`);
        else if (action == `revox`) this.send(`RRRRRRRRRRRRRRRRRRRRRRR`);
        else if (action == `kuba`) this.send(`android to dystrybucja linuxa`);
        else if (action == `alina`) this.send(`wróć :c`);
        else if (action == `majkel`) this.send(`**to cie**kawy chłopak jest`);
        else if (action == `ptak`) this.send(`przestań mi wysyłać azjatki na pw`);
        else if (action == `wiktor`) this.send(`daj buszka`);
        else if (action == `złomek`) this.send(`najlepszy admin`);
        else if (action == `pis`) this.send(`**\*\*\*\*\* \*\*\*!**`);
        else if (action == `furim` || action == `furimm`) this.send(`zasraniec się zesrał`);
        else if (action == `digit` || action == `digitcrusher`) this.send(`zasrany linuxowiec`);
    }
}

module.exports = {
    name: `dosmasters`,
    aliases: [`autoit`, `kris`, `mihaszek`, `mihaszki`, `alex`, `mssc`, `revox`, `kuba`, `alina`, `majkel`, `złomek`, `ptak`, `digit`, `digitcrusher`, `furim`, `furimm`],
    execute(msg, args) {new DosMasters(msg, args)}
}