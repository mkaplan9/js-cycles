const ObjectClass = require('./object');
const Trail = require('./trail');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, (Math.floor(Math.random() * 4)) * Math.PI / 2, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    if (
      (this.x >= Constants.MAP_SIZE) ||
      (this.x <= 0) ||
      (this.y >= Constants.MAP_SIZE) ||
      (this.y <= 0)
    ) {
      this.hp = 0;
    }

    // Create a trail, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Trail(this.id, this.x, this.y, this.direction);
    }

    return null;
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
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Player;
