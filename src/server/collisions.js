const Constants = require('../shared/constants');

function applyGridCollisions(players, grid) {
  Object.values(this.players).forEach(player => {
    // Off grid
    if (
      (player.grid_x >= Constants.GRID_SIZE) ||
      (player.grid_x < 0) ||
      (player.grid_y >= Constants.GRID_SIZE) ||
      (player.grid_y < 0)
    ) {
      player.die();
    // Hits tail
    } else if (grid[player.grid_x][player.grid_y] != 0) {
      player.die();
    // Hits head
    } else if (headsHitDamage(player, players)) {
      player.die();
    }
  })
}

function headsHitDamage(player, players) {
  Object.keys(values).forEach(opponent => {
    if (opponent.player_number < player.player_number) {
      if (opponent.grid_x == player.grid_x) {
        if (opponent.grid_y == player.grid_y) {
          return true;
        }
      }
    }
  })
  return false;
}

module.exports = applyGridCollisions;
