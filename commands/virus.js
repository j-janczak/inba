const Discord = require('discord.js');
const https = require('https');
const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);

function _execute(message, args) {
    if (args.length < 2) return;

    let request = https.get(`https://www.worldometers.info/coronavirus/`, function(response) {
        let webSite = ``;
        let country = args[1].charAt(0).toUpperCase() + args[1].slice(1);

        response.on(`data`, (chunk) => {
            webSite += chunk;
        }).on(`end`, () => {
            let n = webSite.search(`"> ${country} <\/td>`);
            if (n == -1) {
                message.reply(`Nie znalazłem takiego kraju!`);
                return;
            }

            webSite = webSite.slice(n - 140);
            let trStart = webSite.search(`<tr style="">`);
            webSite = webSite.slice(trStart);
            let trEnd = webSite.search(`</tr>`);
            webSite = webSite.slice(14, trEnd);

            let patt = />\s?(\+*\d*)\s?<\/td>/g;
            let regEx = new RegExp(patt);
            let dataArray = [];
            while(result = regEx.exec(webSite)) {
                dataArray.push(result);
            }

            /*
                [0][1] - Total Cases
                [1][1] - New cases
                [2][1] - Total deaths
                [3][1] - New deaths
                [4][1] - Total Recovered
                [5][1] - Active Cases
            */

            let confirmed = (dataArray[0][1] != `` ? dataArray[0][1] : 0);
            let newCases = (dataArray[1][1] != `` ? dataArray[1][1] : 0);
            let recovered = (dataArray[4][1] != `` ? dataArray[4][1] : 0);
            let deaths = (dataArray[2][1] != `` ? dataArray[2][1] : 0);

            let desc = `😷 \`\`Confirmed\`\`: **\`\`${confirmed}\`\`**\n
🤢 \`\`New cases\`\`: **\`\`${newCases}\`\`**\n
🥳 \`\`Recovered\`\`: **\`\`${recovered}\`\`**\n
☠ \`\`Deaths\`\`: **\`\`${deaths}\`\`**
`;

            const rolesEmbed = new Discord.RichEmbed()
                .setTitle(`COVID-19 status for ${country}`)
                .setDescription(desc)
                .setFooter(`Source: https://www.worldometers.info/coronavirus/`)
                .setTimestamp()
                .setColor(`#E57373`);
            message.channel.send(rolesEmbed);
        }).on(`error`, (e) => {
            if (e.errno == `ETIMEDOUT`) message.channel.send(`Error: Strona z danymi nie odpowiada 😕`);
            console.error(e);
        });
    });

    request.on('socket', (s) => { s.setTimeout(1000, () => {
        s.destroy();
        message.channel.send(`Error: Strona z danymi nie odpowiada 😕`)
    })});

    request.on('error', function (e) {
        message.channel.send(`Error: Strona z danymi nie odpowiada 😕`);
    });
}

module.exports = {
    name: 'virus',
    aliases: [`covid-19`, `wirus`, `covid`],
    description: 'virus stats',
    execute(message, args) {_execute(message, args)}
}