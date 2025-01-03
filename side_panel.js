function updateTurn(turn) {
  document.querySelectorAll(".turn").forEach((e) => {
    e.innerHTML = `Turn: ${turn}`;
  })
}

function updateMove(move) {
  document.querySelectorAll(".move").forEach((e) => {
    e.innerHTML = `Move: ${move}`;
  })
}

function updateScoreBoard(usernames, playerNow, scores) {
  document.querySelectorAll(".scoreboard").forEach((e) => {
    e.innerHTML = "";
    usernames.forEach((u, i) => {
      const playerOuter = document.createElement("div");
      playerOuter.setAttribute("class", "player-outer");
      const player = document.createElement("div");
      player.setAttribute("class", "player");
      player.innerHTML = i == playerNow ?
        `<b>-> ${u}</b><br>Score: ${scores[i]}` :
        `<b>${u}</b><br>Score: ${scores[i]}`;
      playerOuter.appendChild(player);
      e.appendChild(playerOuter);
    })
  })
}

function resetSidePanel() {
  document.querySelectorAll(".turn").forEach((e) => {
    e.innerHTML = "";
  });
  document.querySelectorAll(".move").forEach((e) => {
    e.innerHTML = "";
  });
  document.querySelectorAll(".scoreboard").forEach((e) => {
    e.innerHTML = "";
  });
}

export {
  updateTurn,
  updateMove,
  updateScoreBoard,
  resetSidePanel,
};
