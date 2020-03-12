const Discord = require('discord.js');
const https = require('https');
const HTMLParser = require('node-html-parser');
const botConfig = require(`../config/config.json`);

function _execute(message, args) {
    if (args.length < 2) return;

    let request = https.get(`https://www.worldometers.info/coronavirus/`, function(response) {
        let webSite = ``;
        let country = message.cleanContent.slice(botConfig.prefix.length + args[0].length + 2);

        response.on(`data`, (chunk) => {
            webSite += chunk;
        }).on(`end`, () => {
            let domWebSite = HTMLParser.parse(webSite);
            let countryName = ``;
            let countryRow = domWebSite.querySelector(`#main_table_countries tbody`).childNodes.find(row => {
                if (row.tagName == `tr`) {
                    let countryFind = false;
                    if (row.childNodes[1].childNodes.length == 3) {
                        if (country.toUpperCase() == row.childNodes[1].childNodes[1].childNodes[0].rawText.toUpperCase()) {
                            countryFind = true;
                            countryName = row.childNodes[1].childNodes[1].childNodes[0].rawText;
                        }
                    }
                    else {
                        if (country.toUpperCase() == row.childNodes[1].childNodes[0].rawText.slice(1, -1).toUpperCase()) {
                            countryFind = true;
                            countryName = row.childNodes[1].childNodes[0].rawText.slice(1, -1);
                        } 
                    }
                    if (countryFind) {
                        return row;
                    } else return false;
                }
            });

            if (countryRow) {
                let confirmed = (countryRow.childNodes[3].childNodes[0].rawText.trim() != `` ? countryRow.childNodes[3].childNodes[0].rawText.trim() : 0);
                let newCases = (countryRow.childNodes[6].childNodes[0].rawText.trim() != `` ? countryRow.childNodes[6].childNodes[0].rawText.trim() : 0);
                let deaths = (countryRow.childNodes[8].childNodes[0].rawText.trim() != `` ? countryRow.childNodes[8].childNodes[0].rawText.trim() : 0);
                let recovered = (countryRow.childNodes[12].childNodes[0].rawText.trim() != `` ? countryRow.childNodes[12].childNodes[0].rawText.trim() : 0);
            
                let desc = `😷 \`\`Confirmed\`\`: **\`\`${confirmed}\`\`**\n
🤢 \`\`New cases\`\`: **\`\`${newCases}\`\`**\n
🥳 \`\`Recovered\`\`: **\`\`${recovered}\`\`**\n
☠ \`\`Deaths\`\`: **\`\`${deaths}\`\`**
`;

                const rolesEmbed = new Discord.RichEmbed()
                    .setTitle(`COVID-19 status for ${countryName}`)
                    .setDescription(desc)
                    .setFooter(`Source: https://www.worldometers.info/coronavirus/`)
                    .setTimestamp()
                    .setColor(`#E57373`);
                message.channel.send(rolesEmbed);
            } else {
                message.reply(`Nie znalazłem takiego kraju!`);
            }
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