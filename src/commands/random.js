const GifCommand = require('../gifCommand'),
  Discord = require('discord.js');

class Random extends GifCommand {
  constructor() {
    super('random', 300, 30);
  }

  async startCommand() {
    await this.intr.deferReply();

    let userMin, userMax;
    try {
      userMin = parseInt(this.opt.get('min').value),
      userMax = parseInt(this.opt.get('max').value);
    } catch (e) {
      this.int.editReply({ embeds: [this.getEmbed(0, 'Podano niepoprawną liczbę!')]});
      return;
    }

    if (userMax < userMin || userMin == userMax) {
      this.intr.editReply({ embeds: [this.getEmbed(0, 'Liczba minimalna musi być mniejsza niż maksymalna ' + await this.getEmoji('kot'))]});
      return;
    }

    const randomNumbers = [];
    for (let i = 0; i < 200; i++) {
      const rN = Math.floor(Math.random() * (userMax - userMin + 1)) + userMin;
      randomNumbers.push(rN);
    }

    this.encoder.setFrameRate(24);
    this.encoder.start();
    this.context.font = '18px Tahoma';

    const lineWidth = 15;
    const linePos = this.width / 2 - lineWidth / 2;

    let numXPos = 0;
    for (let frame = 0; frame < 200; frame++) {
      this.context.fillStyle = '#36393f';
      this.context.fillRect( 0, 0, this.width, this.height );

      this.context.fillStyle = '#b10000';
      this.context.fillRect(linePos, 0, lineWidth, this.height);

      let nextNumSpace = 0;
      this.context.fillStyle = '#ffffff';
      randomNumbers.forEach(num => {
        const numSize = this.context.measureText(num),
          currNumPos = numXPos + nextNumSpace;

        if (currNumPos + numSize.width > 0 && currNumPos < this.width) this.context.fillText(num, currNumPos, this.height / 2 + numSize.actualBoundingBoxAscent / 2);
        nextNumSpace += numSize.width + 7.5;
      });
      
      if (frame > 20 && frame < 138)
        numXPos -= Math.sin((frame - 20) / 37) * 30;

      this.encoder.addFrame(this.context);
    } 

    this.encoder.finish();

    console.log(randomNumbers);

    const attachment = new Discord.MessageAttachment(this.encoder.out.getData(), 'random.gif');
    this.intr.editReply({ files: [attachment] });
  }
}

const random = new Random();

module.exports = {
  admin: false,
  commandData: {
    name: 'random',
    description: 'Wylosuj liczbę',
    options: [
      {
        name: 'min',
        description: 'Minimalna wartość',
        type: 4,
        required: true
      },
      {
        name: 'max',
        description: 'Maksymalna wartość',
        type: 4,
        required: true
      },
    ]
  },
  execute: random.execute.bind(random)
};