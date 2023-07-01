const KEYS = {
  LEFT: 'KeyA',
  ALT_LEFT: 'ArrowLeft',
  RIGHT: 'KeyD',
  ALT_RIGHT: 'ArrowRight',
  SPACE: 'Space',
  UP: 'KeyW',
  ALT_UP: 'ArrowUp',
  DOWN: 'KeyS',
  ALT_DOWN: 'ArrowDown',
};
const game = {
  canvas: null,
  ctx: null,
  board: null,
  width: 0,
  height: 0,
  gameInterval: null,
  bombInterval: null,
  score: 0,
  dimensions: {
    max: {
      width: 640,
      height: 360,
    },
    min: {
      width: 300,
      height: 300,
    },
  },
  sprites: {
    background: null,
    cell: null,
    body: null,
    food: null,
    head: null,
    bomb: null,
  },
  sounds: {
    bomb: null,
    food: null,
    theme: null,
  },
  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length; 
    required += Object.keys(this.sounds).length;

    const onSourceLoad = () => {
      loaded++;
      if (loaded >= required) {
        callback();
      }
    }
    this.preloadSprites(onSourceLoad);
    this.preloadSounds(onSourceLoad);
  },
  preloadSprites(callback) {
    for (const key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = `img/${key}.png`;
      this.sprites[key].addEventListener('load', callback);
    }
  },
  preloadSounds(callback) {
    for (const key in this.sounds) {
      this.sounds[key] = new Audio(`sounds/${key}.mp3`);
      this.sounds[key].addEventListener('canplaythrough', callback, {
        once: true
      });
    }
  },
  create() {
    this.board.create();
    this.snake.create();
    this.board.createFood();
    this.board.createBomb();

    window.addEventListener('keydown', (evt) => {
      if (evt.code == KEYS.LEFT
        || evt.code == KEYS.ALT_LEFT
        || evt.code == KEYS.RIGHT
        || evt.code == KEYS.ALT_RIGHT
        || evt.code == KEYS.UP
        || evt.code == KEYS.ALT_UP
        || evt.code == KEYS.DOWN
        || evt.code == KEYS.ALT_DOWN
      ) {
      this.snake.start(evt);
    }
      
    });
  },
  render() {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(
        this.sprites.background, 
        (this.width - this.sprites.background.width) / 2, 
        (this.height - this.sprites.background.height) / 2
      );
      // this.ctx.drawImage(this.sprites.cell, 50, 50);
      this.board.render();
      this.snake.render();

      this.ctx.fillText(`Score: ${this.score * 100}`, 30, 30);
    });
  },
  update() {
    this.snake.move();
    this.render();
  },
  run() {
    this.create();

    this.gameInterval = setInterval(() => {
      this.update();
    }, 150);
    this.bombInterval = setInterval(() => {
      if (this.snake.moving) {
        this.board.createBomb();
      }
    }, 3000);
  },
  stop() {
    this.sounds.bomb.play();
    clearInterval(this.gameInterval);
    clearInterval(this.bombInterval);
    alert('Game Over');
    window.location.reload();
  },
  initDimensions() {
    const data = {
      maxWidth: this.dimensions.max.width,
      maxHeight: this.dimensions.max.height,
      minWidth: this.dimensions.min.width,
      minHeight: this.dimensions.min.height,
      realWidth: window.innerWidth,
      realHeight: window.innerHeight,
    };

    if (data.realWidth / data.realHeight > data.maxWidth / data.maxHeight) {
      this.fitWidth(data);
    } else {
      this.fitHeight(data);
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },
  fitHeight(data) {
    this.width = Math.floor(data.realWidth * data.maxHeight / data.realHeight);
    this.width = Math.min(this.width, data.maxWidth);
    this.width = Math.max(this.width, data.minWidth);

    this.height = Math.floor(this.width * data.realHeight / data.realWidth);
    this.canvas.style.height = "100%";
  },
  fitWidth(data) {
    this.height = Math.floor(this.width * data.realHeight / data.realWidth);
    this.height = Math.min(this.height, data.maxHeight);
    this.height = Math.max(this.height, data.minHeight);
    this.width = data.realWidth * this.height / data.realHeight;

    this.canvas.style.width = '100%';
  },
  init() {
    this.canvas = document.querySelector('#mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.initDimensions();
    this.setFonts();
  },
  setFonts() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#fff";
  },
  start() {
    this.init();
    this.preload(() => {
      this.run();
    });
  },
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  onSnakeStart() {
    this.sounds.theme.volume = 0.7;
    this.sounds.theme.loop = true;
    this.sounds.theme.play();
  },
  onSnakeEat() {
    this.score += 1;
    this.sounds.food.play();
  },
}

document.addEventListener("DOMContentLoaded", () => {
  game.start();
});