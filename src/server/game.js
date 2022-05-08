const Constants = require('../shared/constants');
const Player = require('./player');
const applyGridCollisions = require('./collisions');
const { GRID_SIZE, TOTAL_PLAYERS, UPDATE_INTERVAL_MILLIS } = require('../shared/constants');

class Game {
  constructor() {
    this.players = {};
    this.grid = this.initGrid();
    this.shouldSendUpdate = false;
    this.gameLive = false;
    this.gameOver = false;
    this.timeStep = 0;
    setInterval(this.update.bind(this), UPDATE_INTERVAL_MILLIS);
  }

  initGrid() {
    return new Array(GRID_SIZE).fill(0).map(() => new Array(GRID_SIZE).fill(0));
  }

  canAddPlayer() {
    return Object.keys(this.players).length < TOTAL_PLAYERS
  }

  addPlayer(socket, username) {
    // Generate a grid position to start this player at.
    let grid_x;
    let grid_y;
    let grid_dir;
    let color;
    let player_number;
    if (Object.keys(this.players).length === 0) {
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

    this.players[socket.id] = new Player(socket, username, grid_x, grid_y, grid_dir, color, player_number);
  }

  handleInput(socket, grid_dir) {
    if (this.gameLive) {
      const player = this.players[socket.id];
      if (player) {
        player.setDirection(grid_dir);
      }
    }
  }

  shouldStartGame() {
    this.gameLive = (Object.keys(this.players).length === TOTAL_PLAYERS)
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (!this.gameLive) {
      this.shouldStartGame();
      return;
    }

    // Calculate time elapsed
    this.timeStep += 1;

    // Move each player
    Object.values(this.players).forEach(player => {
      player.move();
    });

    // Apply collisons
    applyGridCollisions(Object.values(this.players), this.grid);

    // Update grid
    Object.values(this.players).forEach(player => {
      if (player.alive) {
        const {grid_x, grid_y, player_number} = grid_pos;
        this.grid[grid_x][grid_y] = player_number;
      }
    });

    // Check if only 1 player left
    alive_count = Object.values(this.players).reduce((acc, player) => acc + player.alive, 0)
    if (alive_count < TOTAL_PLAYERS) {
      this.gameLive = false;
      this.gameOver = true;

      winner = Object.values(this.players).filter((player) => player.alive)
      const socket = player.socket;
      socket.emit(Constants.MSG_TYPES.GAME_OVER, player.alive);
      return;
    }

    // Send a game update to each player every other time
    if (this.gameLive) {
      if (this.shouldSendUpdate) {
        Object.values(this.players).forEach(player => {
          if (player.alive) {
            const socket = player.socket;
            socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
          } else {
            const socket = player.socket;
            socket.emit(Constants.MSG_TYPES.GAME_OVER, player.alive);
          }
        });
        this.shouldSendUpdate = false;
      } else {
        this.shouldSendUpdate = true;
      }
    }
  }

  createUpdate(player) {
    const otherPlayers = Object.values(this.players).filter(
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
