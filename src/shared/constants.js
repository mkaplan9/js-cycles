module.exports = Object.freeze({
  UP: "UP",
  DOWN: "DOWN",
  RIGHT: "RIGHT",
  LEFT: "LEFT",

  MAP_SIZE: 600,
  GRID_SIZE: 10,
  BLOCK_AREA: 600 / 100,
  MARGIN: 1,
  BLOCK_SIZE: 6 - 1,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
  UPDATE_INTERVAL_MILLIS: 1000,
  TOTAL_PLAYERS: 2,
});
