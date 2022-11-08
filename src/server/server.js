const express = require('express');
const webpack = require('webpack');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const { TOTAL_PLAYERS } = require('../shared/constants');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const webpackConfig = require('../../webpack.dev.js');
  const webpackDevMiddleware = require('webpack-dev-middleware');

  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);
const liveGames = [];
const playerToGame = {};

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on('disconnect', onDisconnect);
});

function findGameToJoin() {
  let game = liveGames.find(game =>
    !game.gameOver && game.players.length < TOTAL_PLAYERS
  )

  if (!game) {
    game = new Game();
    liveGames.push(game);
  }

  return game;
}

function findGame(socket) {
  return playerToGame[socket.id]
}

function joinGame(username) {
  const game = findGameToJoin();
  playerToGame[this.id] = game;
  game.addPlayer(this, username);
}

function handleInput(grid_dir) {
  const game = findGame(this);
  game.handleInput(this, grid_dir);
}

function onDisconnect() {
  const game = findGame(this);
  if (game) {
    game.removePlayer(this);
  }
}
