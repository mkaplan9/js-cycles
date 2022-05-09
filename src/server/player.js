const Constants = require('../shared/constants');

class Player {
  constructor(socket, username, grid_x, grid_y, grid_dir, color, player_number) {
    this.socket = socket;
    this.username = username;
    this.grid_x = grid_x;
    this.grid_y = grid_y;
    this.grid_dir = grid_dir;
    this.color = color;
    this.player_number = player_number;
    this.alive = true;
  }

  move() {
    switch(this.grid_dir) {
      case Constants.LEFT:
        this.grid_x--;
        break;
      case Constants.UP:
        this.grid_y--;
        break;
      case Constants.RIGHT:
        this.grid_x++;
        break;
      case Constants.DOWN:
        this.grid_y++;
        break;
    }
  }

  die() {
    this.alive = false;
  }

  setDirection(new_grid_dir) {
    if (!this.opposites(new_grid_dir, this.grid_dir)) {
      this.grid_dir = new_grid_dir;
    }
  }

  opposites(dir_1, dir_2) {
    const rl = [dir_1, dir_2].includes(Constants.LEFT) && [dir_1, dir_2].includes(Constants.RIGHT);
    const ud = [dir_1, dir_2].includes(Constants.UP) && [dir_1, dir_2].includes(Constants.DOWN);
    return rl || ud;
  }

  serializeForUpdate() {
    return {
      grid_x: this.grid_x,
      grid_y: this.grid_y,
      color: this.color,
      alive: this.alive,
    };
  }
}

module.exports = Player;
