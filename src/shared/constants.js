module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 100,
  PLAYER_FIRE_COOLDOWN: 0.01,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 101,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  UP: "UP",
  DOWN: "DOWN",
  RIGHT: "RIGHT",
  LEFT: "LEFT",

  MAP_SIZE: 420,
  GRID_SIZE: 60,
  BLOCK_AREA: 420 / 60,
  MARGIN: 1,
  BLOCK_SIZE: 7 - 1,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
  },
});
