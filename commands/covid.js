const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const timeFormat = require(`../my_modules/timeFormat.js`);
const Discord = require(`discord.js`);
const fetch = require(`node-fetch`);

class Covid extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        let url = "https://api.covid19api.com/summary";
        let settings = { method: "Get" };

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                this.received(json)
            });
    }
    received(data) {
        let polandData = data.Countries.find(country => country.Country == `Poland`);
        
        let embed = new Discord.MessageEmbed()
            .setTitle(`☣️ Covid-19 Poland stats ☣️`)
            .setFooter(timeFormat.getDate(polandData.Date).split(`-`)[1])
            .setColor(`#66BB6A`)
            .addField(`New Cases 😷`, polandData.NewConfirmed)
            .addField(`Deaths ☠`, polandData.NewDeaths)
            .addField(`Recovered 😅`, polandData.NewRecovered);
        this.send(embed);
    }
}

module.exports = {
    name: `covid`,
    aliases: [`covid-19`, `corona`, `wirus`],
    execute(msg, args) {new Covid(msg, args)}
}