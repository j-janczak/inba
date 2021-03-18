const botConfig = require('./cfg/config.json');
const Discord = require('discord.js');
const messageLogs = require('./bot_files/message_logs.js');

const commands = require(`./bot_files/commands.js`);

/* TEMP */ const outputs = require(`./bot_files/inbaOutputs.js`);

class MrInba {
    constructor() {
        this.client = new Discord.Client();
        this.client.commands = commands.loadModules(`./commands`);
        this.client.on('ready', (c) => {this.ready(c)});
        this.client.on('message', (msg) => {this.onMessage(msg)});

        this.ml = new messageLogs();

        this.client.login(botConfig.token);
    }
    ready() {
        this.client.user.setActivity(`!ji | Jestem w becie OwO`);
        console.log("Zalogowano");

        this.initCommands();
    }
    onMessage(msg) {
        if (msg.channel.type != `text`) return;

        this.ml.logs(msg);

        //axel antyspam protection
        if (msg.author.id == '690150027242635265') {
            if (new RegExp('^\\+-*[1234567890.]+$', 'g').test(msg.content)) {
                msg.delete().then(_m => {
                    msg.channel.send('❗ AxelBot **anti-spam** protection ❗').then(m => {
                        m.delete({ timeout: 1000 });
                        return;
                    })
                })
            }
        }
        //axel antyspam protection

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
            this.client.commands.get('reputation').execute(msg, args);
        } else {
            const command = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
            if (command) command.execute(msg, args);
        }
    }
    initCommands() {
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
    }
}

new MrInba();