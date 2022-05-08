const Constants = require('../shared/constants');
const Player = require('./player');
const applyGridCollisions = require('./collisions');

class Game {
  constructor() {
    this.players = {};
    this.grid = this.initGrid();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.gameLive = false;
    setInterval(this.update.bind(this), UPDATE_INTERVAL_MILLIS);
  }

  initGrid() {
    return new Array(Constants.GRID_SIZE).fill(0).map(() => new Array(Constants.GRID_SIZE).fill(0));
  }

  canAddPlayer() {
    return Object.keys(this.players).length < 2
  }

  addPlayer(socket, username) {
    // Generate a grid position to start this player at.
    let grid_x;
    let grid_y;
    let grid_dir;
    let color;
    let player_number;
    if (Object.keys(this.players).length === 0) {
      grid_x = Math.floor(Constants.GRID_SIZE / 4)
      grid_y = Math.floor(Constants.GRID_SIZE / 2)
      grid_dir = Constants.RIGHT;
      color = '#6FC3DF';
      player_number = 1;
    } else {
      grid_x = Math.floor(Constants.GRID_SIZE * (3 / 4))
      grid_y = Math.floor(Constants.GRID_SIZE / 2)
      grid_dir = Constants.LEFT;
      color = '#DF740C';
      player_number = 2;
    }

    this.players[socket.id] = new Player(socket, username, grid_x, grid_y, grid_dir, color, player_number);
  }

  handleInput(socket, grid_dir) {
    if (this.gameLive) {
      player = this.players[socket.id];
      if (player) {
        player.setDirection(grid_dir);
      }
    }
  }

  shouldStartGame() {
    this.gameLive = Object.keys(this.players).length > 1
  }

  removeAllPlayers(loserID) {
    Object.keys(this.players).forEach(socketID => {
      const won = loserID != socketID
      this.players[socketID].socket.emit(Constants.MSG_TYPES.GAME_OVER, won);
      this.removePlayer(socketID);
    })
  }

  update() {
    if (!this.gameLive) {
      this.shouldStartGame();
      return;
    }
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

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

    // Check if any players are dead
    Object.values(this.players).forEach(player => {
      if (!player.alive) {
        this.removeAllPlayers(player.socket.id);
        this.gameLive = false;
        this.grid = this.initGrid();
        break;
      }
    })

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      Object.values(this.players).forEach(player => {
        const socket = player.socket;
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, now));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  createUpdate(player, now) {
    const otherPlayers = Object.values(this.players).filter(
      p => p !== player,
    );
    return {
      t: now,
      me: player.serializeForUpdate(),
      others: otherPlayers.map(p => p.serializeForUpdate()),
    };
  }
}

module.exports = Game;
