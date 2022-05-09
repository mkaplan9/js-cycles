const Game = require('./game');
const Constants = require('../shared/constants');

jest.useFakeTimers();

describe('Game', () => {
  describe('constructor', () => {
    it('contructs', () => {
      const game = new Game();

      expect(game.gameLive).toEqual(false);
    })
  });

  describe('initGrid', () => {
    it('initGrid makes grid', () => {
      const game = new Game();
      const grid = game.initGrid();
      expect(grid.length).toEqual(Constants.GRID_SIZE);
    });
  });

  describe('canAddPlayer', () => {
    it('canAddPlayer', () => {
      const game = new Game();

      expect(game.canAddPlayer()).toEqual(true);
      for (let i = 0; i <= Constants.TOTAL_PLAYERS; i++) {
        game.players[i] = null;
      }
      expect(game.canAddPlayer()).toEqual(false);
    });
  });

  describe('addPlayer', () => {
    it('addPlayer', () => {
      const game = new Game();
      const socket = {
        id: '1234',
        emit: jest.fn(),
      };
      game.addPlayer(socket, "my_name")

      expect(game.players[0].username).toEqual("my_name");
      expect(game.players[0].socket).toEqual(socket);
      expect(game.players[0].player_number).toEqual(1);
    });
  });

  describe('handleInput', () => {
    it('handleInput does nothing if no alive player found', () => {
      const game = new Game();
      game.gameLive = true
      const socket = {
        id: '1234',
        emit: jest.fn(),
      };

      game.handleInput(socket, Constants.LEFT)
    });

    it('handleInput updates dir if player found annd dir valid', () => {
      const game = new Game();
      game.gameLive = true
      const socket = {
        id: '1234',
        emit: jest.fn(),
      };

      game.addPlayer(socket, "my_name")
      const player = game.players[0]
      expect(player.grid_dir).toEqual(Constants.RIGHT);
      game.handleInput(socket, Constants.LEFT) // No valid so we expect no change
      expect(player.grid_dir).toEqual(Constants.RIGHT);
      game.handleInput(socket, Constants.UP) // Valid
      expect(player.grid_dir).toEqual(Constants.UP);
    });
  });

  describe('update', () => {
    it('update basic stuff', () => {
      const game = new Game();

      const socket_1 = {
        id: '1',
        emit: jest.fn(),
      };
      player_1 = game.addPlayer(socket_1, "player_1");
      const p1gxi = player_1.grid_x;
      const p1gyi = player_1.grid_y;

      const socket_2 = {
        id: '2',
        emit: jest.fn(),
      };
      player_2 = game.addPlayer(socket_2, "player_2");
      const p2gxi = player_2.grid_x;
      const p2gyi = player_2.grid_y;

      expect(game.gameLive).toEqual(false);
      game.update();
      expect(game.gameLive).toEqual(true);

      game.update()

      expect(player_1.grid_x).toEqual(p1gxi + 1);
      expect(player_1.grid_y).toEqual(p1gyi);
      expect(player_2.grid_x).toEqual(p2gxi - 1);
      expect(player_2.grid_y).toEqual(p2gyi);
      expect(game.grid[p1gxi][p1gyi]).toEqual(player_1.player_number)
      expect(game.grid[player_1.grid_x][player_1.grid_y]).toEqual(player_1.player_number)

      expect(socket_1.emit).toHaveBeenCalledTimes(1);
      expect(socket_1.emit).toHaveBeenCalledWith(Constants.MSG_TYPES.GAME_UPDATE,  {
        timeStep: game.timeStep,
        me: player_1.serializeForUpdate(),
        others: [player_2.serializeForUpdate()],
        grid: game.grid,
      });
    });
  });

  // it('should send updates on every second update', () => {
  //   const game = new Game();
  //   const socket = {
  //     id: '1234',
  //     emit: jest.fn(),
  //   };
  //   game.addPlayer(socket, 'guest');

  //   jest.runOnlyPendingTimers();
  //   expect(socket.emit).toHaveBeenCalledTimes(0);
  //   expect(game.shouldSendUpdate).toBe(true);

  //   jest.runOnlyPendingTimers();
  //   expect(socket.emit).toHaveBeenCalledTimes(1);
  //   expect(socket.emit).toHaveBeenCalledWith(Constants.MSG_TYPES.GAME_UPDATE, expect.any(Object));
  //   expect(game.shouldSendUpdate).toBe(false);
  // });

  // describe('handleInput', () => {
  //   it('should update the direction of a player', () => {
  //     const game = new Game();
  //     const socket = {
  //       id: '1234',
  //       emit: jest.fn(),
  //     };
  //     game.addPlayer(socket, 'guest_1');

  //     game.handleInput(socket, Constants.LEFT);

  //     // Run timers twice, as updates are only sent on every second call
  //     jest.runOnlyPendingTimers();
  //     jest.runOnlyPendingTimers();

  //     expect(socket.emit)
  //       .toHaveBeenCalledWith(
  //         Constants.MSG_TYPES.GAME_UPDATE,
  //         expect.objectContaining({
  //           me: expect.objectContaining({ direction: 2 }),
  //         }),
  //       );
  //   });
  // });
});
