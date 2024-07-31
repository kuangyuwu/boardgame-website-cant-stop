import { Player } from "./player.js";

class Server {
  constructor() {
    this.players = [];
    this.ruleSet = null;

    this.turnCount = 0;
    this.playing = -1;
    this.moveCount = 0;
  }

  connect(client) {
    this.players.push(new Player(client));
    console.log(`Connected to the client ${client.id}`);
  }

  send(player, data) {
    player.client.handle(data);
  }

  sendToAll(data) {
    for (const player in this.players) {
      this.send(player, data);
    }
  }

  sendStart() {
    this.sendToAll({
      type: "start",
      body: {
        pathLengths: this.ruleSet.pathLengths,
        ids: this.players.map((player) => player.id),
      },
    });
  }

  sendTurnCount() {
    this.sendToAll({
      type: "turnCount",
      body: {
        turnCount: this.turnCount,
      },
    });
  }

  sendPlayer(isPlaying) {
    const player = this.players[this.playing];
    this.sendToAll({
      type: "player",
      body: {
        id: player.id,
        isPlaying: isPlaying,
        score: player.score(),
      },
    });
  }

  sendMoveCount() {
    this.sendToAll({
      type: "moveCount",
      body: {
        moveCount: this.moveCount,
      },
    });
  }

  sendRoll() {
    this.send(this.players[this.playing], { type: "roll", body: {} });
  }

  sendDices() {
    const player = this.players[this.playing];
    const dices = rollDices();
    const groupings = [
      [dices[0] + dices[1], dices[2] + dices[3]],
      [dices[0] + dices[2], dices[1] + dices[3]],
      [dices[0] + dices[3], dices[1] + dices[2]],
    ];
    let actions = [];
    let hasOptions = false;
    for (const grouping of groupings) {
      let temp = [];
      const g1 = grouping[0];
      const g2 = grouping[1];
      if (this.isValidAction([g1, g2], player)) {
        temp.push([g1, g2]);
        hasOptions = true;
        continue;
      }
      if (this.isValidAction([g1], player)) {
        temp.push([g1]);
        hasOptions = true;
      }
      if (this.isValidAction([g2], player)) {
        temp.push([g2]);
        hasOptions = true;
      }
      actions.push(temp);
    }
    this.send(player, {
      type: "dices",
      body: {
        dices: dices,
        actions: options,
        hasOptions: hasOptions,
      },
    });
  }

  sendWinner() {
    const player = this.players[this.playing];
    this.sendToAll({
      type: "winner",
      body: {
        winner: player.id,
      },
    });
  }

  sendGameboard() {
    let gameboard = [];
    for ([path, length] of this.ruleSet.pathLengths.entries()) {
      if (length == -1) {
        gameboard.push(null);
      } else {
        gameboard.push(new Array(0));
        for (let j = 0; j < length; j++) {
          gameboard[path].push({
            colors: [],
            hasTemp: false,
          });
        }
      }
    }
    for (const [n, player] of this.players.entries()) {
      for ([path, length] of this.ruleSet.pathLengths.entries()) {
        const j = length - player.state[path] - 1;
        if (j != -1) {
          gameboard[path][j].colors.push(n);
        }
      }
    }
    const n = this.playing;
    const player = this.players[n];
    for (const [path, x] of player.temp.entries()) {
      if (x == 0) {
        continue;
      }
      const j = length - player.state[path] - 1;
      for (let k = 1; k <= x; k++) {
        gameboard[path][j + k].colors.push(n);
        gameboard[path][j + k].hasTemp = true;
      }
    }
    let block = [];
    for ([path, length] of this.ruleSet.pathLengths.entries()) {
      if (length != -1 && this.isComplete(path)) {
        block.push(path);
      }
    }
    this.sendToAll({
      type: "gameboard",
      body: {
        gameboard: gameboard,
        block: block,
      },
    });
  }

  handle(data) {
    console.log(`The server receives the following data:`);
    console.log(data);
    if (data[id] != this.players[this.playing].id) {
      console.log(`Not Player ${data[id]}'s turn`);
      return;
    }
    switch (data.type) {
      case "start":
        this.handlerStart(data.body);
        break;

      default:
        console.log(`Unsupported type`);
        break;
    }
  }

  handlerStart(body) {
    this.ruleSet = ruleSets[body.ruleSet];
    this.turnCount = 0;
    shuffle(this.players);
    for (let player of players) {
      player.initialize(this.ruleSet.pathLengths);
    }
    this.sendStart();
    this.nextTurn();
  }

  nextTurn() {
    this.turnCount++;
    this.playing = -1;
    this.sendTurnCount();
    this.nextPlayer();
  }

  nextPlayer() {
    this.playing++;
    if (this.playing == this.players.length) {
      this.nextTurn();
    }
    this.moveCount = 0;
    this.sendPlayer(true);
    this.nextMove();
  }

  nextMove() {
    this.moveCount++;
    this.sendMoveCount();
    this.sendRoll();
  }

  handlerRoll() {
    this.sendDices();
  }

  handlerAction(body) {
    const action = body.action;
    switch (body.decision) {
      case "lose":
        this.loseTurn();
        break;
      case "stop":
        this.stopTurn(action);
        break;
      case "continue":
        this.continueTurn(action);
        break;

      default:
        break;
    }
  }

  loseTurn() {
    const player = this.players[this.playing];
    player.addMoves(moveCount);
    player.resetTemp();
    this.sendGameboard();
    this.sendPlayer(false);
    this.nextPlayer();
  }

  stopTurn(action) {
    const player = this.players[this.playing];
    for (const path of action) {
      player.takeAction(path);
    }
    player.addMoves(moveCount);
    player.updateState();
    player.resetTemp();
    this.sendGameboard();
    if (player.isWinner(this.ruleSet.goal)) {
      this.sendWinner();
      return;
    }
    this.sendPlayer(false);
    this.nextPlayer();
  }

  continueTurn(action) {
    const player = this.players[this.playing];
    for (const path of action) {
      player.takeAction(path);
    }
    this.sendGameboard();
    this.nextMove();
  }

  isComplete(path) {
    for (const player of self.players) {
      if (player.state[path] == 0) {
        return true;
      }
    }
    return false;
  }

  isValidPath(path, player) {
    if (this.isComplete(path)) {
      return false;
    }
    if (player.temp[path] > 0) {
      return player.state[path] > player.temp[path];
    }
    return player.numTemp() < self.ruleSet.numTemp;
  }

  isValidAction(action, player) {
    for (const [i, path] of action.entries()) {
      if (!this.isValidPath(path, player)) {
        for (let j = i - 1; i >= 0; i--) {
          player.undoAction(action[j]);
        }
        return false;
      }
      player.takeAction(path);
    }
    for (const path of action) {
      player.undoAction(path);
    }
    return True;
  }
}

function rollDices() {
  let dices = [];
  for (let i = 0; i < 4; i++) {
    const dice = Math.floor(Math.random() * 6) + 1;
    dices.push(dice);
  }
  dices.sort((a, b) => a - b);
  return dices;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const ruleSets = {
  0: {
    pathLengths: [-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3],

    numTemp: 3,
    goal: 3,

    dices: [6, 6, 6, 6],
    partitions: [
      [
        [0, 1],
        [2, 3],
      ],
      [
        [0, 2],
        [1, 3],
      ],
      [
        [0, 3],
        [1, 2],
      ],
    ],
  },
};

export { Server, rollDices };
