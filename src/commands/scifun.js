const GifCommand = require('../gifCommand.js'),
  botConfig = require('../config.json'),
  gifFrames = require('gif-frames'),
  Discord = require('discord.js'),
  { log } = require('../utils');

class Scifun extends GifCommand {
  constructor() {
    super('scifun', 300, 300);
  }

  async loadGif() {
    const frameData = await gifFrames({ url: './src/assets/scifun.gif', frames: 'all', cumulative: true });
    for (const frame of frameData) {
      const canvasImage = await this.loadImageFromFrame(frame);
      this.mainGifFrames.push(canvasImage);
    }
    log('Zakończono wczytywanie gifa ' + 'scifun'.green);
  }

  /* @override */
  async startCommand() {
    await this.intr.deferReply();

    const userOpt = this.opt.get('użytkownik'),
      imageOpt = this.opt.get('obrazek');

    const benchmarkTime = (new Date()).getTime();

    let userImage;
    if (userOpt) {
      try {
        userImage = await this.loadImageFromURL(
          userOpt.user.avatarURL({ format: 'png' })
        );
        userImage = this.getRoundedImage(userImage, 80);
      } catch (e) {
        console.error(e);
        this.intr.editReply({ embeds: [this.getEmbed(0, 'Nie udało się pobrać zdjęcia profilowego tego użytkownika')]});
      }
    } else if (imageOpt) {
      const emojiRegex = new RegExp('^<:.+:(\\d+)>$');
      const urlRegex = new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$');
      if (emojiRegex.test(imageOpt.value)) {
        try {
          const emojiID = emojiRegex.exec(imageOpt.value)[1],
            emoji = await this.guild.emojis.fetch(emojiID);
        
          userImage = await this.loadImageFromURL(emoji.url);
          userImage = this.getRoundedImage(userImage, 80);
        } catch (e) {
          this.intr.editReply({ embeds: [this.getEmbed(0, 'Wystąpił błąd podczas przetwarzania emoji')]});
        }
        
      } else if (urlRegex.test(imageOpt.value)) {
        try {
          userImage = await this.loadImageFromURL(imageOpt.value);
          userImage = this.getRoundedImage(userImage, 80);
        } catch (e) {
          this.intr.editReply({ embeds: [this.getEmbed(0, 'Wystąpił błąd podczas pobierania obrazka z linku, czy to na pewno obrazek?')]});
        }
      } else {
        const catEmoji = await this.getEmoji('kot');
        this.intr.editReply({ embeds: [this.getEmbed(0, 'Chyba nie podano poprawnego obrazka ' + catEmoji)]});
      }
    }

    this.encoder.setFrameRate(20);
    this.encoder.start();

    let rotate = 0;
    try {
      for (const [i, frame] of this.mainGifFrames.entries()) {
        this.context.drawImage(frame, 0, 0);
        this.drawRotatedImage(userImage, 115, 210, -rotate);
        this.encoder.addFrame(this.context);
  
        rotate += i / 2.25;
      }
      this.encoder.finish();
  
      const attachment = new Discord.MessageAttachment(this.encoder.out.getData(), 'scifun_kreci.gif'),
        benchmarkTimeEnd = (new Date()).getTime(),
        benchmarkElapsedTime = benchmarkTimeEnd - benchmarkTime,
        benchmarkEmbed = {
          color: botConfig.color,
          title: 'Scifun betoniara benchmark ⏳',
          fields: [
            {
              name: 'Czas',
              value: `${benchmarkElapsedTime}ms*`,
              inline: true
            },
            {
              name: 'Klatki',
              value: `${this.mainGifFrames.length}`,
              inline: true
            },
            {
              name: 'Wymiary',
              value: `${this.width}px x ${this.height}px`,
              inline: true
            },
            {
              name: 'Rozmiar pliku',
              value: `${(attachment.attachment.length / 1024 / 1024).toFixed(2)}mb`,
              inline: true
            },
          ],
          footer: {
            text: '* Czas nie uwzględnia uploadu pliku'
          }
        };
      
      if (!this.opt.get('benchmark') || !this.opt.get('benchmark').value)
        this.intr.editReply({ files: [attachment] });
      else
        this.intr.editReply({ files: [attachment], embeds: [benchmarkEmbed] });
    } catch (e) {
      this.intr.editReply({ embeds: [this.getEmbed(0, 'Wystąpił błąd podczas generowania scifuna, czy na pewno podano poprawny obrazek?')]});
    } 
  }
}

const scifun = new Scifun();

module.exports = {
  admin: false,
  commandData: {
    name: 'scifun',
    description: 'Generuje scifuna co kręci rzeczami jak szalony',
    options: [
      {
        name: 'użytkownik',
        description: 'Niech użytkownik zakręci ci w głowie',
        type: 6,
        required: false
      },
      {
        name: 'obrazek',
        description: 'Wstaw emotkę lub link do obrazka',
        type: 3,
        required: false
      },
      {
        name: 'benchmark',
        description: 'Testuj',
        type: 5,
        required: false
      },
    ]
  },
  execute: scifun.execute.bind(scifun),
  loadGif: scifun.loadGif.bind(scifun)
};