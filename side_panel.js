function updateTurn(turn) {
  const turnCounter = document.getElementById("turn");
  turnCounter.innerHTML = `Turn: ${turn}`;
}

function updateMove(move) {
  const moveCounter = document.getElementById("move");
  moveCounter.innerHTML = `Move: ${move}`;
}

function addPlayers(ids) {
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

export { updateTurn, updateMove, addPlayers, updatePlayer };
