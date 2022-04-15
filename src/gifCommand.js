const Command = require('./command.js'),
  GIFEncoder = require('gif-encoder-2'),
  Canvas = require('canvas');

class GifCommand extends Command {
  /**
   * @param {Number} width Canvas width
   * @param {Number} height Canvas height
   */
  constructor(name, width, height) {
    super(name);
    this.width = width,
    this.height = height;
    this.mainGifFrames = [];
  }

  async execute(interaction, client, componentInteraction) {
    this.canvas = Canvas.createCanvas(this.width, this.height),
    this.context = this.canvas.getContext('2d');
    this.encoder = new GIFEncoder(this.width, this.height);
    super.execute(interaction, client, componentInteraction);
  }

  /* @abstract */
  async createGif() { }

  /**
   * @param {Object} gifFrame Single frame from gif-frames module
   */
  async loadImageFromFrame(gifFrame) {
    return new Promise((resolve, reject) => {
      const i = new Canvas.Image();
      i.onload = () => {
        resolve(i);
      };
      i.onerror = () => {
        reject();
      };
      i.src = gifFrame.getImage()._obj;
    });
  }

  async loadImageFromURL(url) {
    return new Promise((resolve, reject) => {
      const i = new Canvas.Image();
      i.onload = () => {
        resolve(i);
      };
      i.onerror = (e) => {
        reject(e);
      };
      i.src = url;
    });
  }

  // https://gamedev.stackexchange.com/a/67276
  drawRotatedImage(image, x, y, angle) {
    this.context.save();
    this.context.translate(x, y);
    this.context.rotate(angle * (Math.PI / 180));
    this.context.drawImage(image, -(image.width / 2), -(image.height / 2));
    this.context.restore();
  }

  getRoundedImage(image, size) {
    const imageCanvas = Canvas.createCanvas(size, size),
      imageContext = imageCanvas.getContext('2d');

    // https://codepen.io/movii/pen/QBgqeY
    imageContext.beginPath();
    imageContext.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
    imageContext.clip();
    imageContext.drawImage(image, 0, 0, size, size);

    return imageCanvas;
  }
}

module.exports = GifCommand;