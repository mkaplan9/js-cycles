const Constants = require('../shared/constants');
const Player = require('./player');
const applyGridCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.grid = this.initGrid();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.gameLive = false;
    setInterval(this.update.bind(this), 1000 / 10);
  }

  initGrid() {
    return new Array(Constants.GRID_SIZE).fill(0).map(() => new Array(Constants.GRID_SIZE).fill(0));
  }

  canAddPlayer() {
    return Object.keys(this.players).length < 2
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);

    // Generate a grid position to start this player at.
    let grid_x;
    let grid_y;
    let grid_dir;
    if (Object.keys(this.players).length === 0) {
      grid_x = Math.floor(Constants.GRID_SIZE / 4)
      grid_y = Math.floor(Constants.GRID_SIZE / 2)
      grid_dir = Constants.RIGHT;
    } else {
      grid_x = Math.floor(Constants.GRID_SIZE * (3 / 4))
      grid_y = Math.floor(Constants.GRID_SIZE / 2)
      grid_dir = Constants.LEFT;
    }

    this.players[socket.id] = new Player(socket.id, username, x, y, grid_x, grid_y, grid_dir);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir, grid_dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir, grid_dir);
    }
  }

  shouldStartGame() {
    console.log("shouldStartGame")
    console.log(Object.keys(this.players).length)
    this.gameLive = Object.keys(this.players).length > 1
  }

  removeAllPlayers() {
    console.log("Removing all")
    Object.values(this.sockets).forEach(socket => {
      socket.emit(Constants.MSG_TYPES.GAME_OVER);
      this.removePlayer(socket);
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
    let grid_updates = [];
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const grid_pos = player.update(dt);
      grid_updates.push(grid_pos);
    });

    // Apply collisons
    applyGridCollisions(Object.values(this.players), this.grid);

    // Update grid
    grid_updates.forEach(grid_pos => {
      if (grid_pos) {
        const {grid_x, grid_y} = grid_pos;
        this.grid[grid_x][grid_y] = 1;
      }
    });

    // Check if any players are dead

    const socketsArray = Object.entries(this.sockets);
    for(let i=0; i<Object.keys(this.players).length; i++) {
      const playerID = socketsArray[i][0];
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        this.removeAllPlayers();
        this.gameLive = false;
        this.grid = this.initGrid();
        break;
      }
    }

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const otherPlayers = Object.values(this.players).filter(
      p => p !== player,
    );
    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: otherPlayers.map(p => p.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
