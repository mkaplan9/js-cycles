// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { MAP_SIZE, GRID_SIZE, MARGIN, SCALE_MIN } = Constants;
let hasRenderedID = false;
const SNAKES_PER_GRID = 4;
const SNAKE_BLOCK_FULL = MAP_SIZE / GRID_SIZE; // 6
const GRID_BLOCK_FULL = SNAKE_BLOCK_FULL * SNAKES_PER_GRID; // 24

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see
  const scaleRatio = Math.max(1, SCALE_MIN / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const serialized_state = getCurrentState();
  if (!serialized_state || !serialized_state.me) {
    return;
  }

  if (!hasRenderedID) {
    renderID();
    renderColorSquare(serialized_state.me.color);
    hasRenderedID = true;
  }

  // Draw all players
  renderPlayer(serialized_state.me);
  serialized_state.others.forEach(renderPlayer.bind(null));
}

function renderBackground() {
  // Draw boundaries
  context.strokeStyle = 'blue';
  context.fillStyle = 'blue';
  context.lineWidth = 1;
  context.strokeRect(0, 0, MAP_SIZE + MARGIN, MAP_SIZE + MARGIN);
  context.fillRect(0, 0, MAP_SIZE + MARGIN, MAP_SIZE + MARGIN);

  const gridBlockDraw = GRID_BLOCK_FULL - MARGIN;

  // Draw grid
  for(let x=0; x<GRID_SIZE/SNAKES_PER_GRID; x++) { // 24
    for(let y=0; y<GRID_SIZE/SNAKES_PER_GRID; y++) { // 24
      context.fillStyle = 'lightgrey';
      context.clearRect(MARGIN + x * GRID_BLOCK_FULL, MARGIN + y * GRID_BLOCK_FULL, gridBlockDraw, gridBlockDraw);
      context.fillRect(MARGIN + x * GRID_BLOCK_FULL, MARGIN + y * GRID_BLOCK_FULL, gridBlockDraw, gridBlockDraw);
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

// Renders a snake at the given coordinates
function renderPlayer(player) {
  const { grid_x, grid_y, color } = player;

  context.fillStyle = color;
  context.fillRect(MARGIN / 2 + grid_x * SNAKE_BLOCK_FULL, MARGIN / 2 + grid_y * SNAKE_BLOCK_FULL, SNAKE_BLOCK_FULL, SNAKE_BLOCK_FULL);
}

let renderInterval

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderBackground();
  renderColorSquare('black');
  hasRenderedID = false;
  renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
  clearInterval(renderInterval);
}
