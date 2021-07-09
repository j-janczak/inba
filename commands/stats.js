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

            //farmerString += `\`\`\`\n**Count**: ${statusResult.data.count}\n**Total points:** ${statusResult.data.points_total}`;
            
            const statusEmbed = {
                color: botConfig.colors.botColor,
                title: 'Pool Status',
                fields: [
                    {
                        name: 'Farmers',
                        value: statusResult.data.count,
                        inline: true,
                    },
                    {
                        name: 'Points',
                        value: statusResult.data.points_total,
                        inline: true,
                    },
                    {
                        name: 'Netspace',
                        value: `${statusResult.data.netspace_total} TiB`,
                        inline: true,
                    },
                ],
                footer: {
                    text: 'XCH Garden',
                },
                timestamp: new Date()
            };
            
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