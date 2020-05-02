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
  let dir, grid_dir;
  if (e.keyCode === 37) { // left arrow
    dir = 3 * Math.PI / 2.0;
    grid_dir = Constants.LEFT;
  } else if (e.keyCode === 38) { // up arrow
    dir = 0;
    grid_dir = Constants.UP;
  } else if (e.keyCode === 39) { // right arrow
    dir = Math.PI / 2.0;
    grid_dir = Constants.RIGHT;
  } else if (e.keyCode === 40) { // down arrow
    dir = Math.PI;
    grid_dir = Constants.DOWN;
  }

  updateDirection(dir, grid_dir);
}

// function handleInput(x, y) {
//   const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
//   updateDirection(dir, grid_dir);
// }

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', onKeyInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
}
