const Player = require('./player');
const Constants = require('../shared/constants');

describe('Player', () => {
  describe('update', () => {
    it('should gain score each second', () => {
      const player = new Player('123', 'guest');
      const initialScore = player.score;

      player.update(1);

      expect(player.score).toBeGreaterThan(initialScore);
    });

    it('should fire bullet on update', () => {
      const player = new Player('123', 'guest');

      expect(player.update(Constants.PLAYER_FIRE_COOLDOWN / 3))
        .toBeInstanceOf(Bullet);
    });

    it('should not fire bullet during cooldown', () => {
      const player = new Player('123', 'guest');

      player.update(Constants.PLAYER_FIRE_COOLDOWN / 3);

      expect(player.update(Constants.PLAYER_FIRE_COOLDOWN / 3)).toBe(null);
    });
  });

  describe('serializeForUpdate', () => {
    it('include hp and direction in serialization', () => {
      const player = new Player('123', 'guest');

      expect(player.serializeForUpdate())
        .toEqual(expect.objectContaining({
          hp: Constants.PLAYER_MAX_HP,
          direction: expect.any(Number),
        }));
    });
  });
});
