const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const botConfig = require(`../config/config.json`);
const db = require(`../my_modules/database.js`);
const sd = require(`../my_modules/simpleDiscord.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const Discord = require(`discord.js`);

class WelcomeMsg {
    constructor(msg, args) {
        this.msg = msg;
        this.args = args;
        this.type = (args[0].toLowerCase() == `welcomemessage` ? 0 : 1);

        if (args.length < 2) {
            this.sendHelp();
            return;
        }

        this.action = args[1].toLowerCase();
        if (this.action == `add`) this.addMsg();
        else if (this.action == `list`) this.list();
        else if (this.action == `remove`) this.remove();
        else if (this.action == `test`) this.test();
        else if (this.action == `help`) this.sendHelp();
        else sd.send(this.msg, sd.getEmbed(0, op.get(`wellFarMessage`, `unknownCommand`, [args[0]])));
    }
    async addMsg() {
        if (!sd.checkPermission(this.msg)) return;

        if (this.args.length < 3) {
            sd.send(this.msg, sd.getEmbed(0, op.get(`wellFarMessage`, `add`, `error`, `blankMsg`)));
            return;
        }

        let count = await db.query("SELECT COUNT(*) AS msgCount FROM `welcomeMsgs` WHERE `serverFK` = ? AND `msgType` = ?", [this.msg.guild.id, this.type]);
        if (count[0].msgCount > 9) {
            sd.send(this.msg, sd.getEmbed(0, op.get(`wellFarMessage`, `add`, `error`, `tooManyMsgs`)));
            return;
        }

        this.args.splice(0, 2);
        let message = this.args.join(` `).replace(/\n/g, ` `);
        if (message.search(`%u`) == -1) sd.send(this.msg, sd.getEmbed(2, op.get(`wellFarMessage`, `add`, `warning`, `memberNotMontioned`)));

        let result = await db.query("INSERT INTO `welcomeMsgs` (msgID, serverFK, msgType, content) VALUES (NULL, ?, ?, ?)", [this.msg.guild.id, this.type, message]);
        if (result) sd.send(this.msg, sd.getEmbed(1, op.get(`wellFarMessage`, `add`, `success`, `${this.type}`, [message.replace(/`/g, ``)])));
    }
    async list() {
        let result = await db.query("SELECT `content` FROM `welcomeMsgs` WHERE `serverFK` = ? AND `msgType` = ?", [this.msg.guild.id, this.type]);
        if (result.length > 0) {
            let listMsg = `\`\`\`\n`;
            result.forEach((row, rowIndex) => {
                listMsg += `${rowIndex + 1}. ${row.content}\n`;
            });
            listMsg += `\`\`\``;
            sd.send(this.msg, op.get(`wellFarMessage`, `list`, `result`, `${this.type}`) + `\n` + listMsg);
        } else {
            sd.send(this.msg, op.get(`wellFarMessage`, `list`, `noMessages`, `${this.type}`));
        }
    }
    async remove() {
        if (!sd.checkPermission(this.msg)) return;
        if (this.args.length < 3) {
            sd.send(this.msg, sd.getEmbed(0, op.get(`wellFarMessage`, `remove`, `error`, `noMsgID`)));
            return;
        }
        if (isNaN(this.args[2])) {
            sd.send(this.msg, sd.getEmbed(0, op.get(`wellFarMessage`, `remove`, `error`, `notValidID`)));
            return;
        }
        if (parseInt(this.args[2]) < 1) {
            sd.send(this.msg, sd.getEmbed(0, op.get(`wellFarMessage`, `remove`, `error`, `notValidID`)));
            return;
        }

        let result = await db.query("DELETE FROM `welcomeMsgs` WHERE `msgID` = (SELECT `msgID` FROM `welcomeMsgs` WHERE `serverFK` = ? AND `msgType` = ? LIMIT ?, 1)", [this.msg.guild.id, this.type, parseInt(this.args[2] - 1)]);
        if (result.affectedRows == 1) sd.send(this.msg, sd.getEmbed(1, op.get(`wellFarMessage`, `remove`, `success`)));
        else sd.send(this.msg, sd.getEmbed(0, op.get(`wellFarMessage`, `remove`, `error`, `notFound`)));
    }
    async test() {
        if (!sd.checkPermission(this.msg)) return;
        let result = await db.query("SELECT `content` FROM `welcomeMsgs` WHERE `serverFK` = ? AND `msgType` = ?", [this.msg.guild.id, this.type]);
        if (result.length < 1) {
            sd.send(this.msg, op.get(`wellFarMessage`, `list`, `noMessages`, `${this.type}`));
            return;
        }

        let message = result[Math.floor(Math.random() * result.length)].content;
        message = message.replace(`%u`, `<@!${this.msg.author.id}>`);
        this.msg.guild.systemChannel.send(message);
    }
    sendHelp() {
        let descMsg = `
            \`${botConfig.prefix} ${this.args[0]} add <message>\` - Adds a new message to the pool
            \`${botConfig.prefix} ${this.args[0]} remove <message id>\` - Removes the message from the pool
            \`${botConfig.prefix} ${this.args[0]} list\` - Shows all messages with their ID
            \`${botConfig.prefix} ${this.args[0]} test\` - Sends a test message
            \`${botConfig.prefix} ${this.args[0]} help\` - You're here
        `;
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Mr. Inba Manual`)
            .setTitle(`welcomeMessage/farewellMessage`)
            .setDescription(descMsg)
            .setColor(`#6fadc7`);
        this.msg.channel.send(embed);
    }
}

clientEmiter.on(`memberJoined`, async (member) => {
    console.log(`join ${member.guild}`);
    let result = await db.query("SELECT `content` FROM `welcomeMsgs` WHERE `serverFK` = ? AND `msgType` = 0", [member.guild.id]);
    if (result.length < 1) return;

    let message = result[Math.floor(Math.random() * result.length)].content;
    message = message.replace(`%u`, `<@!${member.user.id}>`);
    member.guild.systemChannel.send(message);
});

clientEmiter.on(`memberLeft`, async (member) => {
    console.log(`leave`);
    let result = await db.query("SELECT `content` FROM `welcomeMsgs` WHERE `serverFK` = ? AND `msgType` = 1", [member.guild.id]);
    if (result.length < 1) return;

    let message = result[Math.floor(Math.random() * result.length)].content;
    message = message.replace(`%u`, `\`${member.user.tag}\``);
    member.guild.systemChannel.send(message);
});

module.exports = {
    name: `welcomemessage`,
    aliases: [`farewellmessage`],
    execute(msg, args) {new WelcomeMsg(msg, args)}
}