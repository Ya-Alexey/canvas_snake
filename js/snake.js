game.snake = {
  // game: game,
  cells: [],
  moving: false,
  direction: {
    row: 0,
    col: 0,
    angle: 0,
  },
  directions: {
    up: {
      row: -1,
      col: 0,
      angle: 0,
    },
    down: {
      row: 1,
      col: 0,
      angle: 180,
    },
    left: {
      row: 0,
      col: -1,
      angle: 270,
    },
    right: {
      row: 0,
      col: 1,
      angle: 90,
    }
  },

  create() {
    const startCells = [
      {
        row: 7,
        col: 7,
      },
      {
        row: 8,
        col: 7,
      },
    ];
    this.direction = this.directions.up;

    for (const startCell of startCells) {
      this.cells.push(game.board.getCell(startCell.row, startCell.col));
    }
  },
  renderHead() {
    const head = this.cells[0];
    const halfSize = game.sprites.head.width / 2;

    game.ctx.save();
    game.ctx.translate(head.x + halfSize, head.y + halfSize);
    
    game.ctx.rotate(this.direction.angle * Math.PI / 180);
    game.ctx.drawImage(game.sprites.head, -halfSize, -halfSize);
    game.ctx.restore();
  },
  renderBody() {
    for (let index = 1; index < this.cells.length; index++) {
      game.ctx.drawImage(game.sprites.body, this.cells[index].x, this.cells[index].y);
    }
  },
  render() {
    this.renderHead();
    this.renderBody();
  },
  start(evt) {
    if (evt.code == KEYS.LEFT || evt.code == KEYS.ALT_LEFT) {
      this.direction = this.directions.left;
    } else if (evt.code == KEYS.RIGHT || evt.code == KEYS.ALT_RIGHT) {
      this.direction = this.directions.right;
    } else if (evt.code == KEYS.UP || evt.code == KEYS.ALT_UP) {
      this.direction = this.directions.up;
    } else if (evt.code == KEYS.DOWN || evt.code == KEYS.ALT_DOWN) {
      this.direction = this.directions.down;
    }
    if (!this.moving) {
      this.moving = true;
      game.onSnakeStart()
    }
    
  },
  move() {
    if (!this.moving) {
      return;
    }
    const cell = this.getNextCell();
    if (!cell || this.hasCell(cell) || game.board.isBombCell(cell)) {
      game.stop();
    }
    if (cell) {
      this.cells.unshift(cell);
      if (!game.board.isFoodCell(cell)) {
        this.cells.pop();
      } else {
        game.onSnakeEat();
        game.board.createFood();
      }
    } 
  },
  getNextCell() {
    const head = this.cells[0];
    const row = head.row + this.direction.row;
    const col = head.col + this.direction.col;
    return game.board.getCell(row, col);
  },
  hasCell(cell) {
    return this.cells.find(snakeCell => snakeCell.row == cell.row && snakeCell.col == cell.col);
  },
};