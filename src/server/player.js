const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, grid_x, grid_y, grid_dir, color) {
    super(id, grid_x, grid_y, grid_dir, Constants.PLAYER_SPEED, color);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
  }

  update(dt) {
    super.update(dt);

    if (
      (this.grid_x >= Constants.GRID_SIZE) ||
      (this.grid_x < 0) ||
      (this.grid_y >= Constants.GRID_SIZE) ||
      (this.grid_y < 0)
    ) {
      return null;
    }

    return { grid_x: this.grid_x, grid_y: this.grid_y };
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  takeGridDamage() {
    this.hp = 0;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      hp: this.hp,
    };
  }
}

module.exports = Player;
