const Discord = require(`discord.js`);
const {client, clientEmiter} = require(`../my_modules/discordClient.js`);
const permissions = require('./checkPermission.js');
const timeFormat = require('../my_modules/timeFormat.js');
const db = require(`../my_modules/database.js`);
const op = require(`../my_modules/inbaOutputs.js`);
const sd = require(`../my_modules/simpleDiscord.js`);

const voteEmoji = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`, `🔟`];
const taskData = {
    title: ``,
    choices: [],
    channelID: ``,
    messageID: ``,
    voteCreationStage: 0
}

function errorUpdateTime(msg, taskID, errMsg) {
    let timeStamp = (new Date()).getTime() + 120000;
    db.query("UPDATE `mrinba`.`activeTasks` SET `activeTasks`.`endTimeStamp` = ? WHERE `activeTasks`.`activeTaskID` = ?", [timeStamp, taskID], r => {
        msg.author.send(op.direct(`poll`, errMsg));
    });
}

function getPollEmbed(r, dbResult, finish) {
    let voteData = JSON.parse(dbResult.taskData);
    let member = client.guilds.find(guild => guild.id == dbResult.serverFK).members.find(member => member.id == dbResult.userFK);
    let description = ``;

    let totalReactions = 0;
    let percOfVote = [];
    let columnOfVote = [];

    if(r != null) {
        r.message.reactions.forEach((r, ri) => {
            let isEmojiCorrect = false;
            voteEmoji.forEach(element => { if (element == r._emoji.name) isEmojiCorrect = true; });
            if(!isEmojiCorrect) return;

            totalReactions += r.count - 1;
        });
        
        r.message.reactions.forEach((r, ri) => {
            let isEmojiCorrect = false;
            voteEmoji.forEach(element => { if (element == r._emoji.name) isEmojiCorrect = true; });
            if(!isEmojiCorrect) return;

            let perc = (totalReactions == 0 ? 0 : ((r.count - 1) / totalReactions * 100));
            percOfVote.push(Math.round(perc * 100) / 100);
        });

        percOfVote.forEach((perc, pi) => {
            let tmpColumn = ``;
            for (let ci = 0; ci < (perc / 100) * 16 + 1; ci++) tmpColumn += `▀`;
            columnOfVote.push(tmpColumn);
        });
    }

    voteData.choices.forEach((ch, i) => {
        description += `***\`\`${i + 1}\`\`***:\xa0\xa0__${ch}__\n\xa0\xa0\xa0\xa0\xa0\xa0\xa0${columnOfVote[i]} *${percOfVote[i]}%*`;
        if (i < voteData.choices.length) description += `\n\n`;
    });
    description += `Total votes: ${totalReactions}`;

    let footer = (finish ? `The poll ended at: ${timeFormat.getDate(dbResult.endTimeStamp)}` : `Poll will close at: ${timeFormat.getDate(dbResult.endTimeStamp)}`);
    let color = (finish ? `#F57C00` : `#00E676`);

    return new Discord.RichEmbed()
        .setAuthor(`@${member.displayName} started a poll!`, member.user.avatarURL)
        .setTitle(voteData.title)
        .setDescription(description)
        .setFooter(footer)
        .setColor(color);
}

function reactParser(msg, length) {
    if (length == 1) {
        msg.react(voteEmoji[0])
    } else if (length == 2) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 3) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 4) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .then(() => msg.react(voteEmoji[3]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 5) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .then(() => msg.react(voteEmoji[3]))
            .then(() => msg.react(voteEmoji[4]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 6) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .then(() => msg.react(voteEmoji[3]))
            .then(() => msg.react(voteEmoji[4]))
            .then(() => msg.react(voteEmoji[5]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 7) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .then(() => msg.react(voteEmoji[3]))
            .then(() => msg.react(voteEmoji[4]))
            .then(() => msg.react(voteEmoji[5]))
            .then(() => msg.react(voteEmoji[6]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 8) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .then(() => msg.react(voteEmoji[3]))
            .then(() => msg.react(voteEmoji[4]))
            .then(() => msg.react(voteEmoji[5]))
            .then(() => msg.react(voteEmoji[6]))
            .then(() => msg.react(voteEmoji[7]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 9) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .then(() => msg.react(voteEmoji[3]))
            .then(() => msg.react(voteEmoji[4]))
            .then(() => msg.react(voteEmoji[5]))
            .then(() => msg.react(voteEmoji[6]))
            .then(() => msg.react(voteEmoji[7]))
            .then(() => msg.react(voteEmoji[8]))
            .catch(() => console.error('One of the emojis failed to react.'));
    } else if (length == 10) {
        msg.react(voteEmoji[0])
            .then(() => msg.react(voteEmoji[1]))
            .then(() => msg.react(voteEmoji[2]))
            .then(() => msg.react(voteEmoji[3]))
            .then(() => msg.react(voteEmoji[4]))
            .then(() => msg.react(voteEmoji[5]))
            .then(() => msg.react(voteEmoji[6]))
            .then(() => msg.react(voteEmoji[7]))
            .then(() => msg.react(voteEmoji[8]))
            .then(() => msg.react(voteEmoji[9]))
            .catch(() => console.error('One of the emojis failed to react.'));
    }
}

db.serverEvents.on(`pollTimesUp`, (server, member, task) => {
    setImmediate(() => {
        let pollData = JSON.parse(task[`taskData`]);
        if (pollData.voteCreationStage < 3) member.user.send(op.direct(`poll`, `error_inactivity`));
        else {
            server.channels.find(ch => ch.id == pollData.channelID).fetchMessages({around: pollData.messageID, limit: 1})
            .then(msg => {
                const fetchedMsg = msg.first();
                fetchedMsg.edit(getPollEmbed(fetchedMsg.reactions.first(), task, true));
            });
        }
    });
});

module.exports = {
    name: 'poll',
    aliases: [`vote`, `questionnaire`, `survey`],
    description: 'poll system',
    execute(message, args) {
        db.query("SELECT * FROM `mrinba`.`activeTasks` WHERE (`activeTasks`.`userFK` = ? AND taskFK = '0')", [message.author.id], result => {
            if (message.channel.type == `text`) {
                if (args[1] == `stop` || args[1] == `cancel`) {
                    if (result.length == 1) {
                        db.query("DELETE FROM `mrinba`.`activeTasks` WHERE activeTaskID = ?", result[0].activeTaskID, r => {
                            let voteData = JSON.parse(result[0].taskData);
                            if (voteData.voteCreationStage > 2) {
                                db.serverEvents.emit(`pollTimesUp`, message.guild, message.member, result[0]);
                            }
                            message.reply(op.direct(`poll`, `stopped`)).then(msg => { msg.delete(3000); }).catch(console.error);
                        });
                    } else {
                        message.reply(op.direct(`poll`, `stopped_not_found`)).then(msg => { msg.delete(3000); }).catch(console.error);
                    }
                }
                else if (result.length == 0) {
                    let timeStamp = (new Date()).getTime() + 120000;
                    taskData.channelID = message.channel.id;
                    db.query("INSERT INTO `mrinba`.`activeTasks` (activeTaskID, serverFK, userFK, taskFK, taskData, endTimeStamp) VALUES (NULL, ?, ?, '0', ?, ?)", [message.guild.id, message.author.id, JSON.stringify(taskData), timeStamp]);
                    message.author.send(op.direct(`poll`, `creating_stage_1`, [message.channel.name, message.guild.name]));
                    message.delete();
                } else if (result.length == 1) {
                    message.reply(op.direct(`poll`, `error_userd_has_active_poll`));
                }
            } else if (message.channel.type == `dm` && result.length == 1) {
                let voteData = JSON.parse(result[0].taskData);
                if (message.content.match(/^cancel$/i) && voteData.voteCreationStage < 3) {
                    db.query("DELETE FROM `mrinba`.`activeTasks` WHERE activeTaskID = ?", result[0].activeTaskID, r => {
                        message.author.send(op.direct(`poll`, `creating_canceled`));
                    });
                } else if (voteData.voteCreationStage == 0) {
                    if (message.content.match(/^\s+$/)) { errorUpdateTime(message, result[0].activeTaskID, `error_blank_msg`); return; }
                    if (message.content.length > 100) { errorUpdateTime(message, result[0].activeTaskID, `error_too_long_title`); return; }

                    let timeStamp = (new Date()).getTime() + 300000;
                    voteData.title = message.content.split(`\n`).join(` `);
                    voteData.voteCreationStage = 1;
                    db.query("UPDATE `mrinba`.`activeTasks` SET `activeTasks`.`taskData` = ?, `activeTasks`.`endTimeStamp` = ? WHERE `activeTasks`.`activeTaskID` = ?", [JSON.stringify(voteData), timeStamp, result[0].activeTaskID], r => {
                        message.author.send(op.direct(`poll`, `creating_stage_2`, [voteData.title]));
                    });
                } else if (voteData.voteCreationStage == 1) {
                    if (message.content.match(/^\s+$/)) { errorUpdateTime(message, result[0].activeTaskID, `error_blank_msg`); return; }

                    let choices = message.content.split(`\n`);
                    if (choices.length < 2) { errorUpdateTime(message, result[0].activeTaskID, `error_not_enough_choices`); return; }
                    if (choices.length > 10) { errorUpdateTime(message, result[0].activeTaskID, `error_too_many_choices`); return; }

                    let areChoicesOk = true;
                    choices.forEach(ch => {
                        if (!areChoicesOk) return;
                        if (ch.length > 150) { errorUpdateTime(message, result[0].activeTaskID, `error_choice_too_long`); areChoicesOk = false; return;}
                        if (ch.match(/^\s+$/) || ch == ``) { errorUpdateTime(message, result[0].activeTaskID, `error_choice_blank`); areChoicesOk = false; return;}
                    });
                    if (!areChoicesOk) return;

                    let timeStamp = (new Date()).getTime() + 300000;
                    voteData.choices = choices;
                    voteData.voteCreationStage = 2;
                    let msgChoices = ``;
                    choices.forEach((ch, i) => {
                        msgChoices += `${i + 1}: ${ch}`;
                        if(i < choices.length) msgChoices += `\n`;
                    });
                    db.query("UPDATE `mrinba`.`activeTasks` SET `activeTasks`.`taskData` = ?, `activeTasks`.`endTimeStamp` = ? WHERE `activeTasks`.`activeTaskID` = ?", [JSON.stringify(voteData), timeStamp, result[0].activeTaskID], r => {
                        message.author.send(op.direct(`poll`, `creating_stage_3`, [voteData.title, msgChoices]));
                    });
                } else if (voteData.voteCreationStage == 2) {
                    let endTime = timeFormat.argToTime(message.content);
                    if (!endTime) { errorUpdateTime(message, result[0].activeTaskID, `error_time`); return;}
                    endTime = parseInt(endTime);
                    if (endTime > (parseInt((new Date()).getTime()) + 7200000)) { errorUpdateTime(message, result[0].activeTaskID, `error_time_not_admin`); return;}

                    let pollChannel = client.guilds.find(guild => guild.id == result[0].serverFK).channels.find(channel => channel.id == voteData.channelID);
                    pollChannel.send(`Loading poll...`)
                    .then(msg => {
                        voteData.voteCreationStage = 3;
                        voteData.messageID = msg.id;
                        db.query("UPDATE `mrinba`.`activeTasks` SET `activeTasks`.`taskData` = ?, `activeTasks`.`endTimeStamp` = ? WHERE `activeTasks`.`activeTaskID` = ?", [JSON.stringify(voteData), endTime, result[0].activeTaskID], r => {
                            db.query("SELECT * FROM `mrinba`.`activeTasks` WHERE (`activeTasks`.`taskFK` = 0 AND `activeTasks`.`taskData`->>'$.messageID' = ?)", [msg.id], _r => {
                                msg.edit(getPollEmbed(null, _r[0], false));
                                message.author.send(`Poll posted! ⤵️\nhttps://discordapp.com/channels/${msg.channel.guild.id}/${msg.channel.id}/${msg.id}`);
                            });
                        }); 
                        reactParser(msg, voteData.choices.length); 
                    })
                    .catch(console.error);
                }
            }
        });
    }
};

function onMessageReactionChangedCheckDB(reaction, user) {
    db.query("SELECT * FROM `mrinba`.`activeTasks` WHERE (`activeTasks`.`taskFK` = 0 AND `activeTasks`.`taskData`->>'$.messageID' = ?)", [reaction.message.id], result => {
        if (result.length == 1) {
            reaction.message.edit(getPollEmbed(reaction, result[0], false));
        }
    });
}

client.on(`messageReactionAdd`, message => {
    onMessageReactionChangedCheckDB(message);
})

client.on(`messageReactionRemove`, message => {
    onMessageReactionChangedCheckDB(message);
})