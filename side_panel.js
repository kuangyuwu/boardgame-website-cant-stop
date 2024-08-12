function updateTurnCount(turnCount) {
  const turnCounter = document.getElementById("turn");
  turnCounter.innerHTML = `Turn: ${turnCount}`;
}

function updateMoveCount(moveCount) {
  const moveCounter = document.getElementById("move");
  moveCounter.innerHTML = `Move: ${moveCount}`;
}

function createPlayers(usernames) {
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.innerHTML = "";
  for (const username of usernames) {
    const playerOuter = document.createElement("div");
    playerOuter.setAttribute("class", "player-outer");
    const player = document.createElement("div");
    player.setAttribute("class", "player");
    player.setAttribute("id", `player-${username}`);
    player.innerHTML = `<b>Player ${username}</b><br>Score: 0`;
    playerOuter.appendChild(player);
    scoreboard.appendChild(playerOuter);
  }
}

function updatePlayer(username, isPlaying, score) {
  const player = document.getElementById(`player-${username}`);
  if (isPlaying) {
    player.innerHTML = `<b>** Player ${username} **</b><br>Score: ${score}`;
  } else {
    player.innerHTML = `<b>Player ${username}</b><br>Score: ${score}`;
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
