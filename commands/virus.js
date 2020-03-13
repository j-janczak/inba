const Discord = require('discord.js');
const http = require('http');
const HTMLParser = require('node-html-parser');

function _execute(message, args) {

    let request = http.get(`http://www.gdziewirus.pl/`, function(response) {
        let webSite = ``;

        response.on(`data`, (chunk) => {
            webSite += chunk;
        }).on(`end`, () => {
            onSiteDownloaded(message, HTMLParser.parse(webSite));
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

function onSiteDownloaded(message, webSite) {
    let virusData = [];

    webSite.querySelectorAll(`.infoborder`).forEach(p => {
        let n = p.childNodes[0].rawText.search(`:`);
        virusData.push(p.childNodes[0].rawText.slice(n + 2));
    });
            
    let desc = `🤢\xa0\xa0\xa0\xa0\`\`Zarażeni\`\`: **\`\`${virusData[0]}\`\`**\n
🏥\xa0\xa0\xa0\xa0\`\`Hospitalizowani\`\`: **\`\`${virusData[2]}\`\`**\n
😷\xa0\xa0\xa0\xa0\`\`Kwarantanna\`\`: **\`\`${virusData[3]}\`\`**\n
☠\xa0\xa0\xa0\xa0\`\`Zmarli\`\`: **\`\`${virusData[1]}\`\`**`;

    const rolesEmbed = new Discord.RichEmbed()
        .setTitle(`Jak będzie w kwarantannnie? - sekcja polski`)
        .setDescription(desc)
        .setFooter(`Source: http://www.gdziewirus.pl/`)
        .setTimestamp()
        .setColor(`#E57373`);
    message.channel.send(rolesEmbed);
}

module.exports = {
    name: 'virus',
    aliases: [`covid-19`, `wirus`, `covid`],
    description: 'virus stats',
    execute(message, args) {_execute(message, args)}
}