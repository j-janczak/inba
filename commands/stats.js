const CommandTemplate = require(`./_Command.js`);
const botConfig = require(`../cfg/config.json`);
const axios = require('axios');

class Stats extends CommandTemplate {
    constructor(msg, args, client) {
        super(msg, args, client);

        this.getData();
    }
    async getData() {
        try {
            const statusResult = await axios.get(`https://api.xch.garden/stats`);

            console.log(statusResult.data);

            const formatStr = (str) => {
                for (let i = String(str).length; i < 3; i ++) str = " " + str;
                return str;
            }

            let farmerString = `\`\`\`   ID   | Pk. | Diff\n--------------------\n`;
            statusResult.data.farmers.forEach(farmer => {
                farmerString += `${farmer.launcher_id} | ${formatStr(farmer.points)} | ${formatStr(farmer.difficulty)}\n`;
            });
            farmerString += `\`\`\`\n**Count**: ${statusResult.data.count}\n**Total points:** ${statusResult.data.points_total}`;

            console.log(farmerString);

            const statusEmbed = {
                color: botConfig.colors.botColor,
                title: "Poll Status",
                description: farmerString,
                footer: {
                    text: 'XCH Garden',
                },
                timestamp: new Date()
            }

            this.send({embed: statusEmbed});
        } catch (error) {
            console.error(error)
            this.sendEmbed(0, "Wystąpił błąd!");
        }
    }
}

module.exports = {
    name: `stats`,
    execute(msg, args, client) {new Stats(msg, args, client)}
}