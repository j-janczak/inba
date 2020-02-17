const Discord = require('discord.js');
const https = require(`https`);

function getMemeFromAPI(callback) {
    let url = `https://meme-api.herokuapp.com/gimme`;

    https.get(url,(res) => {
        let body = ``;
        res.on(`data`, (chunk) => { body += chunk;});
        res.on(`end`, () => {
            try {
                let json = JSON.parse(body);
                callback(json);
            } catch (error) {
                console.error(error.message);
            };
        });
    }).on(`error`, (error) => {
        console.error(error.message);
    });
}

function getEmbed(member, meme) {
    return new Discord.RichEmbed()
        .setTitle(meme.title)
        .setURL(meme.postLink)
        .setImage(meme.url)
        .setColor(member.roles.last().color)
        .setFooter(meme.subreddit)
}

module.exports = {
    name: `meme`,
    description: `meme`,
    aliases: [`mem`, `memy`],
    execute(message, args) {
        getMemeFromAPI((meme) => {message.channel.send(getEmbed(message.member, meme))});
    } 
};
