const CommandTemplate = require(`./_Command.js`);
const botConfig = require(`../cfg/config.json`);
const Discord = require(`discord.js`);

class Pool extends CommandTemplate {
    static emojiArray = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`, `🔟`];
    static columnMaxWidth = 16;

    constructor(msg, args) {
        super(msg, args);

        if (args[1] == 'create') this.createPool()

    }
    createPool() {
        const poolContent = this.msg.content.substring(botConfig.prefix.length + 1 + this.args[0].length + 1 + this.args[1].length + 1).split(`\n`)
        if (poolContent.length < 3) return;

        let poolDescription = '';
        poolContent.forEach((element, index) => {
            if (index == 0) return;
            poolDescription += `${index}. ${element}\n▓ 0%\n\n`;
        });

        const poolEmbed = {
            color: this.msg.member.displayColor,
            title: poolContent[0],
            author: {
                name: `${this.msg.member.displayName}`,
                icon_url: this.msg.author.avatarURL(),
            },
            description: poolDescription,
            footer: {
                text: 'Mr. Inba Pool',
            },
	        timestamp: new Date()
        }

        this.send({embed: poolEmbed}, (poolMsg) => {
            this.asyncForEach(Pool.emojiArray.slice(0, poolContent.length - 1), async (emoji) => {
                await poolMsg.react(emoji);
            })
        });

        this.msg.delete();
    }
    static updatePool(reaction) {  
        let reactions = reaction.message.reactions.cache.map((r, i) => {
            return {emoji: i, count: r.count - 1}
        });
        reactions.forEach((r, i) => {
            if (!Pool.emojiArray.includes(r.emoji)) reactions.splice(i, 1);
        });

        let totalPoints = 0;
        reactions.forEach(r => {
            totalPoints += r.count
        });
        reactions.forEach((r, i) => {
            if (reactions[i] == undefined) return;
            if (totalPoints == 0) reactions[i].percent = 0;
            else reactions[i].percent = Math.round(((r.count / totalPoints) * 100) * 100) / 100
        });

        const poolEmbed = reaction.message.embeds[0];
        const poolEmbedDesc = poolEmbed.description.split('\n');
        let poolOptions = []
        poolEmbedDesc.forEach(line => {
            if (line.match(/^\d{1,2}. /g)) poolOptions.push(line)
        });

        let newDescription = ``;
        poolOptions.forEach((opt, i) => {
            newDescription += `${opt}\n`;

            let columnWidth = parseInt(Pool.columnMaxWidth * ((reactions[i] == undefined ? 0 : reactions[i].percent) / 100)) + 1;
            for (let cw = 0; cw < columnWidth; cw++) newDescription += `▓`;
            newDescription += ` ${(reactions[i] == undefined ? 0 : reactions[i].percent)}%\n\n`;
        })

        const newEmbed = {
            color: poolEmbed.color,
            title: poolEmbed.title,
            author: poolEmbed.author,
            description: newDescription,
            footer: {
                text: 'Mr. Inba Pool',
            },
	        timestamp: poolEmbed.timestamp
        }

        reaction.message.edit({embed: newEmbed})
    }
}

module.exports = {
    name: `pool`,
    execute(msg, args) {new Pool(msg, args)},
    reaction(reactionData) {Pool.updatePool(reactionData)}
}