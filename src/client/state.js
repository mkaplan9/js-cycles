let gameUpdates = [];

export function processGameUpdate(update) {
  gameUpdates.push(update);
}

export function getCurrentState() {
  return gameUpdates[gameUpdates.length - 1];
}
