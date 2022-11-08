// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { clearGameUpdates } from './state';

import './css/main.css';
const Constants = require('../shared/constants');

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const gameOverMenu = document.getElementById('game-over-menu');
const playAgainButton = document.getElementById('play-again-button');
const wonMsg = document.getElementById('you-won');
const lostMsg = document.getElementById('you-lost');
const usernameInput = document.getElementById('username-input');
const waitingPage = document.getElementById('waiting-page');
const gameCanvas = document.getElementById('game-canvas');

Promise.all([
  connect(onGameStart, onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    hideAllExcept(waitingPage)
    startCapturingInput();
    clearGameUpdates()
    startRendering();
  };
  playAgainButton.onclick = () => {
    connect(onGameStart, onGameOver),
    // Play!
    play(usernameInput.value);
    hideAllExcept(waitingPage);
    startCapturingInput();
    clearGameUpdates()
    startRendering();
  };
}).catch(console.error);

function onGameStart() {
  
  hideAllExcept(gameCanvas)
}

function onGameOver(won) {
  stopCapturingInput();
  stopRendering();
  gameOverMenu.classList.remove('hidden');
  if (won) {
    wonMsg.classList.remove('hidden');
  } else {
    lostMsg.classList.remove('hidden');
  }
}

function hideAllExcept(pageToShow) {
  playMenu.classList.add('hidden');
  gameOverMenu.classList.add('hidden');
  wonMsg.classList.add('hidden');
  lostMsg.classList.add('hidden');
  waitingPage.classList.add('hidden');
  gameCanvas.classList.add('hidden');

  pageToShow.classList.remove('hidden');
}