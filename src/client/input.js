// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection } from './networking';
const Constants = require('../shared/constants');

function onMouseInput(e) {
  // handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  // const touch = e.touches[0];
  // handleInput(touch.clientX, touch.clientY);
}

function onKeyInput(e) {
  let grid_dir;
  if (e.keyCode === 37) { // left arrow
    grid_dir = Constants.LEFT;
  } else if (e.keyCode === 38) { // up arrow
    grid_dir = Constants.UP;
  } else if (e.keyCode === 39) { // right arrow
    grid_dir = Constants.RIGHT;
  } else if (e.keyCode === 40) { // down arrow
    grid_dir = Constants.DOWN;
  } else if (e.keyCode === 80) { // letter p
    grid_dir = Constants.PAUSE;
  }

  console.log(grid_dir)

  if (grid_dir) {
    updateDirection(grid_dir);
  }
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('keydown', onKeyInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('keydown', onMouseInput);
}
