const { log, dbDateToPL } = require('../utils.js'),
  botConfig = require('../config.json'),
  Command = require('../command.js'),
  axios = require('../axios.js');

class Birthdays extends Command {
  constructor(interaction, client) {
    super(interaction, client);
    
    if (this.intr.options.get('użytkownik')) this.downloadUser();
    else this.downloadFullList();
  }

  async downloadFullList() {
    let birthdaysList;
    try {
      birthdaysList = await axios.get('birthdays');
    } catch (e) {
      log('ERROR! '.red + 'podczas pobierania listy urodzin'.brightRed);
      console.error(e);
      return;
    }

    let embedDesc = '',
      nextBirthday = false;
    const today = new Date();
    birthdaysList.forEach((birthday, i) => {
      const birthdayDate = new Date(birthday.date);

      if (birthdayDate.getMonth() == today.getMonth() && birthdayDate.getDate() == today.getDate() && !nextBirthday) {
        embedDesc += `**${dbDateToPL(birthdayDate)} - <@${birthday.userID}> To dzisiaj! 🎂**`;
        nextBirthday = true;
      } else if ((birthdayDate.getMonth() > today.getMonth() && !nextBirthday) || 
                (birthdayDate.getMonth() == today.getMonth() && birthdayDate.getDate() > today.getDate() && !nextBirthday)) {
        embedDesc += `**${dbDateToPL(birthdayDate)} - <@${birthday.userID}> Najbliższe!**`;
        nextBirthday = true;
      } else
        embedDesc += `${dbDateToPL(birthdayDate)} - <@${birthday.userID}>`;

      if (i < birthdaysList.length - 1) embedDesc += '\n';
    });

    const birthdaysEmbed = {
      color: botConfig.color,
      title: 'Lista urodzin DosMasters! 🎉',
      description: embedDesc
    };

    this.intr.reply({ embeds: [birthdaysEmbed] });
  }

  async downloadUser() {
    const user = this.intr.options.get('użytkownik');

    let birthdayData;
    try {
      birthdayData = await axios.get('birthdays/' + user.value);
    } catch (e) {
      log('ERROR! '.red + 'podczas pobierania listy urodzin'.brightRed);
      console.error(e);
      return;
    }

    if (birthdayData.length) {
      const today = new Date(),
        birthday = new Date(birthdayData[0].date);

      birthday.setFullYear(today.getFullYear());

      let diff = (today.getTime() > birthday.getTime()) ? 31556926000 - (today.getTime() - birthday.getTime()) : birthday.getTime() - today.getTime();
      diff = Math.ceil(diff / (1000 * 3600 * 24));

      this.intr.reply(`${user.member.displayName} ma urodziny ${dbDateToPL(birthdayData[0].date)}, to już za ${diff} dni!`);
    } else {
      const kotEmoji = await this.getEmoji('kotcry');
      this.intr.reply('Nie mam tego użytkownika zapisanego w bazie danych ' + kotEmoji);
    }
  }
}

module.exports = {
  admin: false,
  commandData: {
    name: 'urodziny',
    description: 'Wyświetla listę urodzin użytkowników 🎂',
    options: [
      {
        name: 'użytkownik',
        description: 'Wybierz użytkownika',
        type: 6
      }
    ]
  },
  execute: Birthdays
};