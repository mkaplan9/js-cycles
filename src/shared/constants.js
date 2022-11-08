module.exports = Object.freeze({
  UP: "UP",
  DOWN: "DOWN",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  PAUSE: "P",

  MAP_SIZE: 576,
  GRID_SIZE: 96,
  MARGIN: 2,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    GAME_START: 'start',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
  UPDATE_INTERVAL_MILLIS: 100,
  TOTAL_PLAYERS: 2,
  SCALE_MIN: 800,
});
