const botConfig = require('../config.json'),
  Command = require('../command.js'),
  axios = require('../axios.js');

class Ping extends Command {
  constructor(interaction, client) {
    super(interaction, client);
    
    if (this.intr.options.getSubcommand() == 'plus') this.giveRepToUser(1);
    if (this.intr.options.getSubcommand() == 'minus') this.giveRepToUser(-1);
    if (this.intr.options.getSubcommand() == 'status') this.checkStatus();
    if (this.intr.options.getSubcommand() == 'ranking') this.ranking();
  }

  async giveRepToUser(point) {
    if (this.intr.user.id == this.intr.options.get('użytkownik').value) {
      this.intr.reply(await this.getEmoji(this.randomArray(this.badEmoji)));
      return;
    }

    try {
      const result = await axios.post('rep/giveRep', {
        serverID: this.intr.guild.id,
        senderUserID: this.intr.user.id,
        userID: this.intr.options.get('użytkownik').value,
        point: point,
        reason: (this.intr.options.get('powód')) ? this.intr.options.get('powód').value.replace(/(\r\n|\n|\r)/gm, ' ') : null
      });

      const emoji = (point == 1) ? await this.getEmoji(this.randomArray(this.goodEmoji)) : await this.getEmoji(this.randomArray(this.badEmoji));

      const repEmbed = {
        color: this.intr.options.get('użytkownik').member.displayColor ? this.intr.options.get('użytkownik').member.displayColor : botConfig.color,
        description: `<@${this.intr.options.get('użytkownik').value}> *(${result.points} rep)* dostał **${(point == 1) ? '+1' : '-1'}** od <@${this.intr.user.id}> ${emoji}`,
      };
      
      if (this.intr.options.get('powód')) {
        let reason = this.intr.options.get('powód').value;
        if (reason.length > 175) reason = reason.slice(0, 175) + '...';
        reason = reason.replace(/(\r\n|\n|\r)/gm, ' ');

        repEmbed.footer = {
          text: `„${reason}”`
        };
      }

      this.intr.reply({embeds: [repEmbed]});
    } catch (e) {
      this.sendEmbed(0, e);
    }
  }

  async checkStatus() {
    try {
      const userID = (this.intr.options.get('użytkownik')) ? this.intr.options.get('użytkownik').value : this.intr.user.id,
        apiQuery = await axios.get('rep/' + this.intr.guild.id + '/' + userID),
        emoji = (apiQuery.points > 0) ? await this.getEmoji(this.randomArray(this.goodEmoji)) : await this.getEmoji(this.randomArray(this.badEmoji));

      if (this.intr.options.get('szczegółowe') && this.intr.options.get('szczegółowe').value) {
        const member = (this.intr.options.get('użytkownik')) ? this.intr.options.get('użytkownik').member : this.intr.member;
        
        let plus = 0, minus = 0, reasons = '';
        apiQuery.repHistory.forEach(rep => {
          if (rep.point == '+1') plus++;
          else minus++;

          if (rep.reason) {
            let reason = rep.reason;
            if (reason.length > 100) reason = reason.slice(0, 100) + '...';
            reasons += `<@${rep.senderID}>: „${reason}” **${rep.point}**\n`;
          }
        });

        let description = `Łącznie: **${apiQuery.points}** (+${plus} | -${minus})\n\n${reasons}`;

        const repEmbed = {
          color: (member.displayColor) ? member.displayColor : botConfig.color,
          title: 'Punkty reputacji',
          author: {
            name: member.displayName
          },
          thumbnail: {
            url: member.user.avatarURL()
          },
          description: description
        };

        this.intr.reply({embeds: [repEmbed]});
      } else {
        this.sendEmbed(1, `<@${userID}> posiada **${apiQuery.points}pk** reputacji ${emoji}`);
      }
    } catch (e) {
      this.sendEmbed(0, e);
    }
  }

  async ranking() {
    const apiQuery = await axios.get('rep/' + this.intr.guild.id);

    let description = '';
    apiQuery.forEach((rep, i) => {
      description += `${i + 1}. <@${rep.userID}>: **${rep.repPoints}pk**\n`;
    });

    const repEmbed = {
      color: botConfig.color,
      title: `Top of ${this.intr.guild.name}`,
      thumbnail: {
        url: this.intr.guild.iconURL(),
      },
      description: description
    };

    this.intr.reply({embeds: [repEmbed]});
  }
}

module.exports = {
  admin: false,
  commandData: {
    name: 'rep',
    description: 'Serwerowe punkty reputacji',
    options: [
      {
        name: 'plus',
        description: 'Dodaj punkt reputacji',
        type: 1,
        options: [
          {
            name: 'użytkownik',
            description: 'Wybierz użytkownika',
            type: 6,
            required: true
          },
          {
            name: 'powód',
            description: 'Krótka notka dlaczego ten gość jest seksownym gnojkiem',
            type: 3,
          }
        ]
      },
      {
        name: 'minus',
        description: 'Odejmnij punkt reputacji',
        type: 1,
        options: [
          {
            name: 'użytkownik',
            description: 'Wybierz użytkownika',
            type: 6,
            required: true
          },
          {
            name: 'powód',
            description: 'Krótka notka dlaczego nie lubisz gościa',
            type: 3,
          }
        ]
      },
      {
        name: 'status',
        description: 'Sprawdź punkty',
        type: 1,
        options: [
          {
            name: 'użytkownik',
            description: 'Wybierz użytkownika. Jeżeli puste, sprawdza twoje punkty',
            type: 6,
          },
          {
            name: 'szczegółowe',
            description: 'Wyświetla więcej informacji',
            type: 5,
          },
        ]
      },
      {
        name: 'ranking',
        description: 'Topka reputacji na serwerze',
        type: 1,
      }
    ]
  },
  execute: Ping
};
