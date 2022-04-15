const GifCommand = require('../gifCommand'),
  gifFrames = require('gif-frames'),
  Discord = require('discord.js'),
  { log } = require('../utils');

class Enjoyer extends GifCommand {
  constructor() {
    super('enjoyer', 320, 320);
  }

  async loadGif() {
    const frameData = await gifFrames({ url: './src/assets/enjoyer.gif', frames: 'all', cumulative: true });
    for (const frame of frameData) {
      const canvasImage = await this.loadImageFromFrame(frame);
      this.mainGifFrames.push(canvasImage);
    }
    log('Zakończono wczytywanie gifa ' + 'enjoyer'.green);
  }

  async startCommand() {
    await this.intr.deferReply();
    this.encoder.setFrameRate(12);
    this.encoder.start();

    this.context.font = '18px Impact';

    const fanText = this.opt.get('fan').value.toUpperCase();
    const enjoyerText = this.opt.get('enjoyer').value.toUpperCase();
    
    if (fanText.length > 17 || enjoyerText.length > 17) {
      this.intr.editReply({ ephemeral: true, embeds: [this.getEmbed(0, 'Podano zbyt długi tekst, maksymalna dozwolona długość to 17 znaków')]});
      return;
    }

    const half1line1 = this.context.measureText('AVERAGE'),
      half1line2 = this.context.measureText(fanText),
      half1line3 = this.context.measureText('FAN');

    const half2line1 = this.context.measureText('AVERAGE'),
      half2line2 = this.context.measureText(enjoyerText),
      half2line3 = this.context.measureText('ENJOYER');

    try {
      for (const frame of this.mainGifFrames) {
        this.context.drawImage(frame, 0, 0);

        this.context.fillText('AVERAGE', this.width / 4 - half1line1.width / 2, half1line1.emHeightAscent - 3);
        this.context.fillText(fanText, this.width / 4 - half1line2.width / 2, half1line2.emHeightAscent * 2 - 4);
        this.context.fillText('FAN', this.width / 4 - half1line3.width / 2, half1line3.emHeightAscent * 3 - 5);
        
        this.context.fillText('AVERAGE', this.width * 0.75 - half2line1.width / 2, half2line1.emHeightAscent - 3);
        this.context.fillText(enjoyerText, this.width * 0.75 - half2line2.width / 2, half2line2.emHeightAscent * 2 - 4);
        this.context.fillText('ENJOYER', this.width * 0.75 - half2line3.width / 2, half2line3.emHeightAscent * 3 - 5);

        this.encoder.addFrame(this.context);
      }
      this.encoder.finish();

      const attachment = new Discord.MessageAttachment(this.encoder.out.getData(), 'enjoyer.gif');
      this.intr.editReply({ files: [attachment] });
    }
    catch (e) {
      console.error(e);
      this.intr.editReply({ embeds: [this.getEmbed(0, 'Wystąpił błąd podczas generowania gifa')]});
    }


  }
}

const enjoyer = new Enjoyer();

module.exports = {
  admin: false,
  commandData: {
    name: 'enjoyer',
    description: 'Zostań gigachadem',
    options: [
      {
        name: 'fan',
        description: ':despair:',
        type: 3,
        required: true
      },
      {
        name: 'enjoyer',
        description: ':gigachad:',
        type: 3,
        required: true
      },
    ]
  },
  execute: enjoyer.execute.bind(enjoyer),
  loadGif: enjoyer.loadGif.bind(enjoyer)
};