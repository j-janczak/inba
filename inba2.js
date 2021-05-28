const messageLogs = require('./bot_files/message_logs.js');
const inbaDB = require('./bot_files/inbaDB.js');
const botConfig = require('./cfg/config.json');
const Discord = require('discord.js');

const commands = require(`./bot_files/commands.js`);

/* TEMP */ const outputs = require(`./bot_files/inbaOutputs.js`);

class MrInba {
    constructor() {
        this.client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
        this.client.commands = commands.loadModules(`./commands`);

        this.client.on('ready', (c) => {this.ready(c)});
        this.client.on('message', (msg) => {if (!msg.partial) this.onMessage(msg)});
        this.client.on('messageReactionAdd', (reaction, user) => {this.onMessageReaction(reaction, user)});
        this.client.on('messageReactionRemove', (reaction, user) => {this.onMessageReaction(reaction, user)});
        this.client.on('channelCreate', (channel) => {this.onChannelCreate(channel)});
        this.client.on('guildCreate', (guild) => {this.onGuildCreate(guild)});
        this.client.on('guildMemberAdd', (guildMember) => {this.onGuildMemberAddRemove(guildMember, 1)});
        this.client.on('guildMemberRemove', (guildMember) => {this.onGuildMemberAddRemove(guildMember, 0)});

        this.ml = new messageLogs();

        this.client.login(botConfig.token);
    }
    ready() {
        this.client.user.setActivity(`!ji | Jestem w becie OwO`);
        console.log("Zalogowano");

        //this.initCommands();
    }
    onMessage(msg) {
        if (msg.channel.type != `text`) return;

        this.ml.logs(msg);

        if (msg.author.id == this.client.user.id) return;
        if (msg.content == botConfig.prefix) return msg.channel.send(outputs.get(`ping`, [`<@!${msg.author.id}>`]));

        const isMessageRep            = msg.content.match(new RegExp(`^(${botConfig.prefix} )?\\.?(\\+|-)rep`, 'g')),
              messageBeginsWithPrefix = msg.content.match(new RegExp(`^${botConfig.prefix} `, 'g'));
        if (!isMessageRep && !messageBeginsWithPrefix) return

        let args = [],
            result,
            argsPatt = new RegExp(/(?: "([^"\n]+)")|(?: ([^"\n ]+))/g);
        if (messageBeginsWithPrefix) while (result = argsPatt.exec(` ${msg.content.slice(botConfig.prefix.length + 1)}`)) args.push(result[1] ? result[1] : result[2]);
        else while (result = argsPatt.exec(msg.content)) args.push(result[1] ? result[1] : result[2]);

        if (isMessageRep) {
            if (messageBeginsWithPrefix) {
                args.unshift(botConfig.prefix)
            } else {
                args.unshift(isMessageRep[0]);
                args.unshift('');
            }
            this.client.commands.get('reputation').execute(msg, args, this.client);
        } else {
            const command = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
            if (command) command.execute(msg, args, this.client);
        }
    }
    async onMessageReaction(reaction, user) {
        if (user.id == this.client.user.id) return;
        if (reaction.partial) await reaction.fetch();
        if (reaction.message.partial) await reaction.message.fetch();
        
        if (reaction.message.author.id == this.client.user.id && reaction.message.embeds) {
            if (reaction.message.embeds[0].footer != null && reaction.message.embeds[0].footer.text == 'Mr. Inba Poll') {
                this.client.commands.get('poll').reaction(reaction);
            }
        }
    }
    onChannelCreate(channel) {
        if (!['text', 'category', 'voice'].includes(channel.type)) return;
        this.client.commands.get('mute').newChannel(channel);
    }
    async onGuildCreate(guild) {
        const result = await inbaDB.send('servers', {_id: guild.id, name: guild.name});
        console.log(result);
    }
    async onGuildMemberAddRemove(guildMember, type) {
        try {
            const messagesToSend = (type) ? await inbaDB.get('servers/welcomeMessages', [guildMember.guild.id]) : await inbaDB.get('servers/farewellMessages', [guildMember.guild.id]);
            if (messagesToSend.data.messages.length > 0) {
                const mNo = commands.getRandomInt(0, messagesToSend.data.messages.length);
                const messageToSend = (type) ? messagesToSend.data.messages[mNo].replace('%u', `<@${guildMember.user.id}>`) : messagesToSend.data.messages[mNo].replace('%u', `\`${guildMember.user.tag}\``);

                guildMember.guild.systemChannel.send(messageToSend);
            }
        } catch(e) {console.error(e)}
    }
}

new MrInba();











/*initCommands() {
        //this.client.api.applications(this.client.user.id).guilds('599715795391610904').commands('793491355350728724').delete()
        //this.client.api.applications(this.client.user.id).guilds('599715795391610904').commands('793491878590283796').delete()

        this.client.api.applications(this.client.user.id).guilds('599715795391610904').commands.get().then(console.log);
        this.client.api.applications(this.client.user.id).guilds('599715795391610904').commands.post({data: {
            name: 'random',
            description: 'Wysyła randomową liczbę. Ale super!',
            options: [
                {
                    name: "Początek",
                    description: "Początek zakresu",
                    type: 4,
                    required: true,
                },
                {
                    name: "Koniec",
                    description: "Koniec zakresu",
                    type: 4,
                    required: true
                }
            ]
        }})

        this.client.ws.on('INTERACTION_CREATE', async interaction => {
            console.log(interaction);
            let start = interaction.data.options.find(opt => opt.name == 'początek').value,
                end = interaction.data.options.find(opt => opt.name == 'koniec').value,
                msg = '';

            if (end <= start) msg = 'Zakres końcowy musi być większy od początkowego!';
            else if (start < 0) msg = 'Liczby muszą być dodatnie!';
            else if (end > 1000) msg = 'Maksymalny zakres to 0-1000';
            else msg = `${outputs.get('ping')} ${Math.floor((Math.random() * (end - start)) + start)}`;

            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: msg
                    }
                }
            })
        })
    }*/