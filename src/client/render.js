// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { MAP_SIZE, GRID_SIZE, BLOCK_SIZE, BLOCK_AREA } = Constants;
let hasRenderedID = false;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others } = getCurrentState();
  if (!me) {
    return;
  }

  if (!hasRenderedID) {
    renderID();
    renderColorSquare(me.color);
    hasRenderedID = true;
  }

  // Draw all players
  renderPlayer2(me);
  others.forEach(renderPlayer2.bind(null));
}

function renderBackground2() {
  // Draw boundaries
  context.strokeStyle = 'black';
  context.fillStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(0, 0, MAP_SIZE, MAP_SIZE);
  context.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

  // Draw grid
  for(let x=0; x<GRID_SIZE; x++) {
    for(let y=0; y<GRID_SIZE; y++) {
      context.fillStyle = 'lightgrey';
      context.clearRect(x * BLOCK_AREA, y * BLOCK_AREA, BLOCK_SIZE, BLOCK_SIZE);
      context.fillRect(x * BLOCK_AREA, y * BLOCK_AREA, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function renderID() {
  context.font = '50px serif';
  context.fillStyle = 'white';
  context.fillText('Your color', 10, MAP_SIZE + 100);
}

function renderColorSquare(color) {
  context.fillStyle = color;
  context.clearRect(250, MAP_SIZE + 50, 50, 50);
  context.fillRect(250, MAP_SIZE + 50, 50, 50);
}

// Renders a ship at the given coordinates
function renderPlayer2(player) {
  const { grid_x, grid_y, color } = player;

  context.fillStyle = color;
  context.clearRect(grid_x * BLOCK_AREA, grid_y * BLOCK_AREA, BLOCK_SIZE, BLOCK_SIZE);
  context.fillRect(grid_x * BLOCK_AREA, grid_y * BLOCK_AREA, BLOCK_SIZE, BLOCK_SIZE);
}

let renderInterval

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderBackground2();
  renderColorSquare('black');
  hasRenderedID = false;
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
}
