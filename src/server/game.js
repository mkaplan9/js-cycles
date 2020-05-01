const Constants = require('../shared/constants');
const Player = require('./player');
const applyCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.trails = [];
    this.grid = new Array(Constants.GRID_SIZE).fill(0).map(() => new Array(Constants.GRID_SIZE).fill(0));
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);

    // // Generate a grid position to start this player at.
    // let x;
    // let y;
    // if (this.players.length == 0) {
    //   x = Math.floor(Constants.GRID_SIZE / 4)
    //   y = Math.floor(Constants.GRID_SIZE / 2)
    // } else {
    //   x = Math.floor(Constants.GRID_SIZE * (3 / 4))
    //   y = Math.floor(Constants.GRID_SIZE / 2)
    // }

    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newTrail = player.update(dt);
      if (newTrail) {
        this.trails.push(newTrail);
      }
    });

    // Apply collisions
    applyCollisions(Object.values(this.players), this.trails);

    // // Update each player
    // Object.keys(this.sockets).forEach(playerID => {
    //   const player = this.players[playerID];
    //   const {x, y} = player.update(dt);
    //   if (newGridSquare) {
    //     this.grid[x][y] = 1
    //   }
    // });

    // // Apply collisions
    // applyGridCollisions(Object.values(this.players), this.grid);

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

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
      trails: this.trails.map(t => t.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
