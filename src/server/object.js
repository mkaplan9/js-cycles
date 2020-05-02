const Constants = require('../shared/constants');

class Object {
  constructor(id, x, y, grid_x, grid_y, dir, grid_dir, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.grid_x = grid_x;
    this.grid_y = grid_y;
    this.direction = dir;
    this.grid_dir = grid_dir;
    this.speed = speed;
  }

  update(dt) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);

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

    console.log(this.grid_dir)
    console.log(this.x)
    console.log(this.grid_x)
    console.log(this.y)
    console.log(this.grid_y)
    console.log("__________________")
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir, grid_dir) {
    this.direction = dir;

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
      x: this.x,
      y: this.y,
      grid_x: this.grid_x,
      grid_y: this.grid_y,
    };
  }
}

module.exports = Object;
