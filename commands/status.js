const CommandTemplate = require(`../my_modules/CommandTemplate.js`);
const botConfig = require(`../config/config.json`);
const { exec } = require("child_process");
const Discord = require(`discord.js`);

class Status extends CommandTemplate {
    constructor(msg, args) {
        super(msg, args);

        let battery = 0;
        let uptime = "0";

        exec("cat /sys/class/power_supply/battery/capacity", (error, stdout, stderr) => {
            battery = stdout;
            exec("uptime | sed 's/.*up \\([^,]*\\), .*/\\1/'", (error, stdout, stderr) => {
                uptime = stdout;

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Mr. Inba status`)
                    .setColor(botConfig.botColor)
                    .addField(`UpTime ⏲`, uptime.trim())
                    .addField(`Server battery 🔋`, `${battery.trim()}%`)
                this.send(embed);
            });
        }); 
    }
}

module.exports = {
    name: `status`,
    execute(msg, args) {new Status(msg, args)}
}