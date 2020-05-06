// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';

// I'm using Bootstrap here for convenience, but I wouldn't recommend actually doing this for a real
// site. It's heavy and will slow down your site - either only use a subset of Bootstrap, or just
// write your own CSS.
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';
const Constants = require('../shared/constants');

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const gameOverMenu = document.getElementById('game-over-menu');
const playAgainButton = document.getElementById('play-again-button');
const wonMsg = document.getElementById('you-won');
const lostMsg = document.getElementById('you-lost');
const usernameInput = document.getElementById('username-input');

Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    wonMsg.classList.add('hidden');
    lostMsg.classList.add('hidden');
    initState();
    startCapturingInput();
    startRendering();
    setLeaderboardHidden(false);
  };
  playAgainButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    gameOverMenu.classList.add('hidden');
    wonMsg.classList.add('hidden');
    lostMsg.classList.add('hidden');
    initState();
    startCapturingInput();
    startRendering();
    setLeaderboardHidden(false);
  };
}).catch(console.error);

function onGameOver(won) {
  stopCapturingInput();
  stopRendering();
  gameOverMenu.classList.remove('hidden');
  if (won) {
    wonMsg.classList.remove('hidden');
  } else {
    lostMsg.classList.remove('hidden');
  }
  setLeaderboardHidden(true);
}
