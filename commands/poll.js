const CommandTemplate = require(`./_Command.js`);
const botConfig = require(`../cfg/config.json`);

class Poll extends CommandTemplate {
    static emojiArray = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`, `🔟`];
    static columnMaxWidth = 16;

    constructor(msg, args, client) {
        super(msg, args, client);

        if (args.length == 1) this.help();
        else {
            if (args[1] == 'help') this.help();
            if (args[1] == 'create') this.createPoll();
        }
    }
    createPoll() {
        const pollContent = this.msg.content.substring(botConfig.prefix.length + 1 + this.args[0].length + 1 + this.args[1].length + 1).split(`\n`)
        if (pollContent.length < 3) {
            this.sendEmbed(2, `The poll must have a title and at least two options, check \`${botConfig.prefix} poll help\``)
            return;
        } else if (pollContent.length > 11) {
            this.sendEmbed(2, `The maximum number of poll options is 10`)
            return;
        }

        let pollDescription = '';
        pollContent.forEach((element, index) => {
            if (index == 0) return;
            pollDescription += `${index}. ${element}\n▓ 0%\n\n`;
        });

        const pollEmbed = {
            color: this.msg.member.displayColor,
            title: pollContent[0],
            author: {
                name: `${this.msg.member.displayName}`,
                icon_url: this.msg.author.avatarURL(),
            },
            description: pollDescription,
            footer: {
                text: 'Mr. Inba Poll',
            },
	        timestamp: new Date()
        }

        this.send({embed: pollEmbed}, (pollMsg) => {
            this.asyncForEach(Poll.emojiArray.slice(0, pollContent.length - 1), async (emoji) => {
                await pollMsg.react(emoji);
            })
        });

        this.msg.delete();
    }
    static updatePoll(reaction) {  
        let reactions = reaction.message.reactions.cache.map((r, i) => {
            return {emoji: i, count: r.count - 1}
        });
        reactions.forEach((r, i) => {
            if (!Poll.emojiArray.includes(r.emoji)) reactions.splice(i, 1);
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

        const pollEmbed = reaction.message.embeds[0];
        const pollEmbedDesc = pollEmbed.description.split('\n');
        let pollOptions = []
        pollEmbedDesc.forEach(line => {
            if (line.match(/^\d{1,2}. /g)) pollOptions.push(line)
        });

        let newDescription = ``;
        pollOptions.forEach((opt, i) => {
            newDescription += `${opt}\n`;

            let columnWidth = parseInt(Poll.columnMaxWidth * ((reactions[i] == undefined ? 0 : reactions[i].percent) / 100)) + 1;
            for (let cw = 0; cw < columnWidth; cw++) newDescription += `▓`;
            newDescription += ` ${(reactions[i] == undefined ? 0 : reactions[i].percent)}%\n\n`;
        })

        const newEmbed = {
            color: pollEmbed.color,
            title: pollEmbed.title,
            author: pollEmbed.author,
            description: newDescription,
            footer: {
                text: 'Mr. Inba Poll',
            },
	        timestamp: pollEmbed.timestamp
        }

        reaction.message.edit({embed: newEmbed})
    }
    help() {
        const desc = `
\`\`\`${botConfig.prefix} ${this.args[0]} create
Is Mr. Inba the best bot? 
Yes
No
\`\`\`
This command creates polls. The first line under the command is the title of the poll, remaining lines are the next poll options (max 10)\n\nNext lines in the Discord text field are created with the **Shift + Enter** combination`;
        this.sendHelp("Poll", desc);
    }
}

module.exports = {
    name: `poll`,
    execute(msg, args, client) {new Poll(msg, args, client)},
    reaction(reactionData) {Poll.updatePoll(reactionData)}
}