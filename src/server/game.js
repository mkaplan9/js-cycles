const Constants = require('../shared/constants');
const Player = require('./player');
const applyGridCollisions = require('./collisions');
const { GRID_SIZE, TOTAL_PLAYERS, UPDATE_INTERVAL_MILLIS } = require('../shared/constants');

class Game {
  constructor() {
    this.socketIdToPlayer = {};
    this.players = []
    this.grid = this.initGrid();
    this.gameLive = false;
    this.gameOver = false;
    this.timeStep = 0;
    setInterval(this.update.bind(this), UPDATE_INTERVAL_MILLIS);
  }

  initGrid() {
    return new Array(GRID_SIZE).fill(0).map(() => new Array(GRID_SIZE).fill(0));
  }

  canAddPlayer() {
    return this.players.length < TOTAL_PLAYERS
  }

  addPlayer(socket, username) {
    // Generate a grid position to start this player at.
    let grid_x;
    let grid_y;
    let grid_dir;
    let color;
    let player_number;
    if (this.players.length === 0) {
      grid_x = Math.floor(GRID_SIZE / 4)
      grid_y = Math.floor(GRID_SIZE / 2)
      grid_dir = Constants.RIGHT;
      color = '#6FC3DF';
      player_number = 1;
    } else {
      grid_x = Math.floor(GRID_SIZE * (3 / 4))
      grid_y = Math.floor(GRID_SIZE / 2)
      grid_dir = Constants.LEFT;
      color = '#DF740C';
      player_number = 2;
    }

    const player = new Player(socket, username, grid_x, grid_y, grid_dir, color, player_number);
    this.socketIdToPlayer[socket.id] = player;
    this.players.push(player);

    this.grid[grid_x][grid_y] = player_number;

    return player;
  }

  removePlayer(socket) {
    const player = this.socketIdToPlayer[socket.id];
    if (player) {
      if (player.alive) {
        player.die();
      }

      if (!this.gameLive) {
        const removeIndex = this.players.indexOf(player)
        this.players.splice(removeIndex, 1);
        this.players.forEach((player, i) => {
          player.player_number = i;
        })

        delete this.socketIdToPlayer[socket.id]
      }
    }
  }

  handleInput(socket, grid_dir) {
    if (this.gameLive) {
      const player = this.socketIdToPlayer[socket.id];
      if (player && player.alive) {
        player.setDirection(grid_dir);
      }
    }
  }

  shouldStartGame() {
    this.gameLive = (this.players.length === TOTAL_PLAYERS)
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (!this.gameLive) {
      this.shouldStartGame();
      if (this.gameLive) {
        this.players.forEach(player => {
          const socket = player.socket;
          socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
        });
      }
      return;
    }

    // Calculate time elapsed
    this.timeStep += 1;

    // Move each player
    this.players.forEach(player => {
      player.move();
    });

    // Apply collisons
    applyGridCollisions(this.players, this.grid);

    // Check if only 1 player left
    const alive_count = this.players.reduce((acc, player) => acc + player.alive, 0)
    if (alive_count === 1) {
      this.gameLive = false;
      this.gameOver = true;

      this.players.forEach(player => {
        const socket = player.socket;
        socket.emit(Constants.MSG_TYPES.GAME_OVER, player.alive);
      })
      return;
    }

    // Update grid
    this.players.forEach(player => {
      if (player.alive) {
        this.grid[player.grid_x][player.grid_y] = player.player_number;
      }
    });

    // Send a game update to each player
    if (this.gameLive) {
      this.players.forEach(player => {
        if (player.alive) {
          const socket = player.socket;
          socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
        } else {
          const socket = player.socket;
          socket.emit(Constants.MSG_TYPES.GAME_OVER, player.alive);
        }
      });
    }
  }

  createUpdate(player) {
    const otherPlayers = this.players.filter(
      p => p !== player,
    );
    return {
      timeStep: this.timeStep,
      me: player.serializeForUpdate(),
      others: otherPlayers.map(p => p.serializeForUpdate()),
      grid: this.grid,
    };
  }
}

module.exports = Game;
