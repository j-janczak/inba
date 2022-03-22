const botConfig = require('../config.json'),
  Command = require('../command.js'),
  axios = require('../axios.js'),
  log = require('../log.js');

class Birthdays extends Command {
  constructor(interaction, client) {
    super(interaction, client);
    this.downloadFullList();
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
      const birthdayDate = new Date(birthday.date),
        D = ('0' + birthdayDate.getDate()).slice(-2),
        M = ('0' + (birthdayDate.getMonth() + 1)).slice(-2),
        Y = String(birthdayDate.getFullYear());

      if (birthdayDate.getMonth() == today.getMonth() && birthdayDate.getDate() == today.getDate() && !nextBirthday) {
        embedDesc += `**${D}.${M}.${Y} - <@${birthday.userID}> To dzisiaj! 🎂**`;
        nextBirthday = true;
      } else if (birthdayDate.getMonth() > today.getMonth() && !nextBirthday) {
        embedDesc += `**${D}.${M}.${Y} - <@${birthday.userID}> Najbliższe!**`;
        nextBirthday = true;
      } else if (birthdayDate.getMonth() == today.getMonth() && birthdayDate.getDate() > today.getDate() && !nextBirthday) {
        embedDesc += `**${D}.${M}.${Y} - <@${birthday.userID}> Najbliższe!**`;
        nextBirthday = true;
      } else
        embedDesc += `${D}.${M}.${Y} - <@${birthday.userID}>`;

      if (i < birthdaysList.length - 1) embedDesc += '\n';
    });

    const birthdaysEmbed = {
      color: botConfig.color,
      title: 'Lista urodzin DosMasters! 🎉',
      description: embedDesc
    };

    this.intr.reply({ embeds: [birthdaysEmbed] });
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