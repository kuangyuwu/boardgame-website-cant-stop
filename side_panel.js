function updateTurnCount(turnCount) {
  const turnCounter = document.getElementById("turn");
  turnCounter.innerHTML = `Turn: ${turnCount}`;
}

function updateMoveCount(moveCount) {
  const moveCounter = document.getElementById("move");
  moveCounter.innerHTML = `Move: ${moveCount}`;
}

function createPlayers(ids) {
  const scoreboard = document.getElementById("scoreboard");
  for (const id of ids) {
    const playerOuter = document.createElement("div");
    playerOuter.setAttribute("class", "player-outer");
    const player = document.createElement("div");
    player.setAttribute("class", "player");
    player.setAttribute("id", `player-${id}`);
    player.innerHTML = `<b>Player ${id}</b><br>Score: 0`;
    playerOuter.appendChild(player);
    scoreboard.appendChild(playerOuter);
  }
}

function updatePlayer(id, isPlaying, score) {
  const player = document.getElementById(`player-${id}`);
  if (isPlaying) {
    player.innerHTML = `<b>** Player ${id} **</b><br>Score: ${score}`;
  } else {
    player.innerHTML = `<b>Player ${id}</b><br>Score: ${score}`;
  }
}

function resetSidePanel() {
  const turnCounter = document.getElementById("turn");
  turnCounter.innerHTML = "";
  const moveCounter = document.getElementById("move");
  moveCounter.innerHTML = "";
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.innerHTML = "";
}

export {
  updateTurnCount,
  updateMoveCount,
  createPlayers,
  updatePlayer,
  resetSidePanel,
};
