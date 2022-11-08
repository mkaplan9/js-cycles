const Constants = require('../shared/constants');

function applyGridCollisions(players, grid) {
  const oldAlives = players.filter((p) => p.alive)
  players.forEach(player => {
    // Off grid
    if (
      (player.grid_x >= Constants.GRID_SIZE) ||
      (player.grid_x < 0) ||
      (player.grid_y >= Constants.GRID_SIZE) ||
      (player.grid_y < 0)
    ) {
      console.log(player.player_number + " " + "off grid")
      player.die();
    // Hits tail
    } else if (grid[player.grid_x][player.grid_y] != 0) {
      console.log(player.player_number + " " + "hit tail")
      player.die();
    // Hits head
    } else if (headsHitDamage(player, players)) {
      console.log(player.player_number + " " + "hit head")
      player.die();
    }
  })
  const newAlives = players.filter((p) => p.alive)
  if (newAlives.length === 0) {
    oldAlives[0].alive = true;
  }
}

function headsHitDamage(player, players) {
  players.forEach(opponent => {
    if (opponent.player_number < player.player_number) {
      if (opponent.grid_x === player.grid_x) {
        if (opponent.grid_y === player.grid_y) {
          return true;
        }
      }
    }
  })
  return false;
}

module.exports = applyGridCollisions;
