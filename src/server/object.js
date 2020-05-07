const Constants = require('../shared/constants');

class Object {
  constructor(id, grid_x, grid_y, grid_dir, speed, color) {
    this.id = id;
    this.grid_x = grid_x;
    this.grid_y = grid_y;
    this.grid_dir = grid_dir;
    this.speed = speed;
    this.color = color;
  }

  update(dt) {
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

  setDirection(grid_dir) {
    if (!this.opposites(grid_dir, this.grid_dir)) {
      this.grid_dir = grid_dir;
    }
  }

  opposites(dir_1, dir_2) {
    const rl = [dir_1, dir_2].includes(Constants.LEFT) && [dir_1, dir_2].includes(Constants.RIGHT);
    const ud = [dir_1, dir_2].includes(Constants.UP) && [dir_1, dir_2].includes(Constants.DOWN);
    return rl || ud;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      grid_x: this.grid_x,
      grid_y: this.grid_y,
      color: this.color,
    };
  }
}

module.exports = Object;
