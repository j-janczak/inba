const {client, clientEmiter} = require(`./my_modules/discordClient.js`);
const botConfig = require(`./config/config.json`);
const db = require(`./my_modules/database.js`);
const sd = require(`./my_modules/simpleDiscord.js`);
const op = require(`./my_modules/inbaOutputs.js`);
const commands = require(`./my_modules/commands.js`);
const colors = require('colors');

/*const prompt = require('prompt');
prompt.start();*/

client.commands = commands.loadModules(`./commands`);

client.once(`ready`, () => {
    client.user.setActivity(`Type !mi help`, {type: `PLAYING`});
    console.log(`Inba powstał! - ${client.guilds.size} serwerów 🖥`.gray);
    client.guilds.forEach(g => {console.log(g.name.gray)});

    /*prompt.get(['command'], function (err, result) {
        if (err) { console.error }
        console.log(result.command);
    });*/
});

client.on(`message`, message => {
    if (message.author.id == client.user.id) return;
    if (message.channel.type == `dm`) {
        client.commands.get(`poll`).execute(message, []);
        return;
    }
    //if (message.content.match(/^\**_*(x|X)D+\**_*$/) && (message.guild.id == `616029849882066959` || message.guild.id == `599715795391610904`)) message.channel.send(`XD`);
    //if (message.author.id == `599379615886344192`) message.react(`🏳️‍🌈`).then();

    console.log(`·`.brightGreen, `${message.member.displayName}`.cyan, `in`.grey, `${message.guild.name}`.cyan, `at`.grey, `#${message.channel.name}:`.cyan, `${message.cleanContent}`);

    if (message.content.search("jezus") != -1){
        message.channel.send(`tak jak pan jezus powiedział`);
    }
    
    if (!message.content.startsWith(botConfig.prefix)) return;

    let args = message.content.slice(botConfig.prefix.length + 1).toLowerCase().split(/ +/);
	if(args[0] == ``) args = [];
	const userCommand = args[0]

	let prefixSearch = `^${botConfig.prefix} `;
	let prefixRegEx = new RegExp(prefixSearch, `g`);

	if (message.content == botConfig.prefix) sd.send(message, op.random(`ping`));
    else if (message.content.match(prefixRegEx)) {
        const command = client.commands.get(userCommand) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(userCommand));
        if(command) command.execute(message, args);
        else if (userCommand === `autoit`) {
            sd.send(message, `posysa`);
        } else if (userCommand === `kris`) {
            sd.send(message, `to kryptogej`);
        } else if (userCommand === `mihaszek`) {
            sd.send(message, `to penis`);
        } else if (userCommand === `alex`) {
            sd.send(message, `Izrael powinien przejąć tereny należące do Palestyny.`);
        } else if (userCommand === `mssc`) {
            sd.send(message, `oddaj hajs krisowi`);
        } else if (userCommand === `revox`) {
            sd.send(message, `:R:`);
        } else if (userCommand === `kuba`) {
            sd.send(message, `android to dystrybucja linuxa`);
        } else if (userCommand === `alina`) {
            sd.send(message, `napraw mi vpsa`);
        } else if (userCommand === `majkel`) {
            sd.send(message, `**to cie**kawy chłopak jest`);
        } else if (userCommand === `złomek`) {
            sd.send(message, `stop adminofaszyzmowi`);
        } else if (userCommand === `ptak`) {
            sd.send(message, `przestań mi wysyłać skośnookie na pw`);
        } else if (userCommand === `wiktor`) {
            sd.send(message, `nie znam type choć podobno znam`);
        } else if (userCommand === `carl-bot`) {
            sd.send(message, `To podbot w dodatku nas szpieguje`);
        } else if (userCommand === `wracaj`) {
            sd.send(message, `Nie chcę wracać do tych pojebów`);
        } else {
            sd.send(message, op.random(`commandNotFound`));
        }
    }
});

client.on(`guildMemberAdd`, member => {
	clientEmiter.emit(`memberJoined`, member);
});

client.on(`guildMemberRemove`, member => {
    clientEmiter.emit(`memberLeft`, member);
});

client.on('raw', packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = client.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
}); //https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md <3

client.login(botConfig.token);