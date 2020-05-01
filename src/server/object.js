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
  }

  update_grid(dt) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir) {
    this.direction = dir;
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
