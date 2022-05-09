const Player = require('./player');
const Constants = require('../shared/constants');

describe('Player', () => {
  describe('constructor', () => {
    it('contructs', () => {
      const socket = {};
      const player = new Player(socket, "my_username", 0, 0, Constants.UP, "#ffffff", 1);

      expect(player.player_number).toEqual(1);
    })
  });

  describe('move', () => {
    it('moves', () => {
      const player = new Player(null, "my_username", 10, 10, Constants.UP, "#ffffff", 1);

      expect(player.grid_dir).toEqual(Constants.UP);
      expect(player.grid_x).toEqual(10);
      expect(player.grid_y).toEqual(10);

      player.move();
      player.grid_dir = Constants.RIGHT;
      player.move();

      expect(player.grid_dir).toEqual(Constants.RIGHT);
      expect(player.grid_x).toEqual(11);
      expect(player.grid_y).toEqual(9);
    })
  });

  describe('die', () => {
    it('returns correct bool', () => {
      const player = new Player(null, "my_username", 10, 10, Constants.UP, "#ffffff", 1);

      expect(player.alive).toEqual(true);
      player.die();
      expect(player.alive).toEqual(false);
    });
  });

  describe('setDirection', () => {
    it('sets direction', () => {
      const player = new Player(null, "my_username", 10, 10, Constants.UP, "#ffffff", 1);

      expect(player.grid_dir).toEqual(Constants.UP);
      player.setDirection(Constants.RIGHT);
      expect(player.grid_dir).toEqual(Constants.RIGHT);
    });

    it('ignores opposite', () => {
      const player = new Player(null, "my_username", 10, 10, Constants.UP, "#ffffff", 1);

      expect(player.grid_dir).toEqual(Constants.UP);
      player.setDirection(Constants.DOWN);
      expect(player.grid_dir).toEqual(Constants.UP);
    });
  });

  describe('opposites', () => {
    it('opposites', () => {
      const player = new Player(null, "my_username", 10, 10, Constants.UP, "#ffffff", 1);

      expect(player.opposites(Constants.UP, Constants.DOWN)).toEqual(true);
      expect(player.opposites(Constants.UP, Constants.LEFT)).toEqual(false);
      expect(player.opposites(Constants.RIGHT, Constants.LEFT)).toEqual(true);
      expect(player.opposites(Constants.RIGHT, Constants.DOWN)).toEqual(false);
    });
  });

  describe('serializeForUpdate', () => {
    it('serializes correctly', () => {
      const player = new Player(null, "my_username", 10, 10, Constants.UP, "#ffffff", 1);

      expect(player.serializeForUpdate())
        .toEqual(expect.objectContaining({
          alive: true,
          grid_x: 10,
        }));
    });
  });
});
