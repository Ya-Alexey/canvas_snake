game.board = {
  size: 15,
  cells: [],
  // game: game,
  create() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.cells.push(this.createCell(row, col));
      }
    }
  },
  createCell(row, col) {
    // console.log(game);
    const cellSize = game.sprites.cell.width + 1;
    const offsetX = (game.width - cellSize * this.size) / 2;
    const offsetY = (game.height - cellSize * this.size) / 2;
    return {
      row,
      col,
      x: offsetX + cellSize * col,
      y: offsetY + cellSize * row,
    }
  },
  getCell(row, col) {
    return this.cells.find(boardCell => boardCell.row == row && boardCell.col == col);
  },
  render() {
    this.cells.forEach(cell => {
      game.ctx.drawImage(game.sprites.cell, cell.x, cell.y);
      if (cell.type) {
        game.ctx.drawImage(game.sprites[cell.type], cell.x, cell.y);
      }
    });
  },
  getRandomAvialabelCell() {
    const pool = this.cells.filter(cell => !cell.type && !game.snake.hasCell(cell));
    const index = game.random(0, pool.length - 1);
    return pool[index];
  },
  createCellObject(type) {
    let cell = this.cells.find(cell => cell.type == type);
    if (cell) {
      cell.type = false;
    }
    cell = this.getRandomAvialabelCell();
    cell.type = type;
  },
  createFood() {
    this.createCellObject('food');
  },
  isFoodCell(cell) {
    return cell.type == 'food';
  },
  createBomb() {
    this.createCellObject('bomb');
  },
  isBombCell(cell) {
    return cell.type == 'bomb';
  },
};