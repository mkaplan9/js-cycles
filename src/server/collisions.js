const Constants = require('../shared/constants');

function applyGridCollisions(players, grid) {
  for (let i = 0; i < players.length; i++) {
    player = players[i];

    if (
      (player.grid_x >= Constants.GRID_SIZE) ||
      (player.grid_x < 0) ||
      (player.grid_y >= Constants.GRID_SIZE) ||
      (player.grid_y < 0)
    ) {
      player.takeGridDamage();
    } else if (grid[player.grid_x][player.grid_y] == 1) {
      player.takeGridDamage();
    }
  }
}


module.exports = applyGridCollisions;
