import { Player } from "./player.js";

class Server {
  constructor() {
    this.players = [];
    this.ruleSet = null;

    this.turnCount = 0;
    this.playing = 0;
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
    for (const player of this.players) {
      this.send(player, data);
    }
  }

  sendStart() {
    const data = {
      type: "start",
      body: {
        pathLengths: this.ruleSet.pathLengths,
        ids: this.players.map((player) => player.id),
      },
    };
    this.sendToAll(data);
  }

  sendTurnCount() {
    const data = {
      type: "turnCount",
      body: {
        turnCount: this.turnCount,
      },
    };
    this.sendToAll(data);
  }

  sendPlayer(isPlaying) {
    const player = this.players[this.playing];
    const data = {
      type: "player",
      body: {
        id: player.id,
        isPlaying: isPlaying,
        score: player.score(),
      },
    };
    this.sendToAll(data);
  }

  sendMoveCount() {
    const data = {
      type: "moveCount",
      body: {
        moveCount: this.moveCount,
      },
    };
    this.sendToAll(data);
  }

  sendRoll() {
    const player = this.players[this.playing];
    const data = { type: "roll", body: {} };
    this.send(player, data);
  }

  sendDices() {
    const player = this.players[this.playing];
    const dices = rollDices();
    const groupings = [
      [dices[0] + dices[1], dices[2] + dices[3]],
      [dices[0] + dices[2], dices[1] + dices[3]],
      [dices[0] + dices[3], dices[1] + dices[2]],
    ];
    let options = [];
    let hasOptions = false;
    for (const grouping of groupings) {
      let temp = [];
      const g1 = grouping[0];
      const g2 = grouping[1];
      if (this.isValidAction([g1, g2], player)) {
        temp.push([g1, g2]);
        hasOptions = true;
        options.push([...temp]);
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
      options.push([...temp]);
    }
    const data = {
      type: "dices",
      body: {
        dices: dices,
        options: options,
        hasOptions: hasOptions,
      },
    };
    this.send(player, data);
  }

  sendContinue() {
    const player = this.players[this.playing];
    const data = {
      type: "continue",
      body: null,
    };
    this.sendToAll(data);
  }

  sendWinner() {
    const player = this.players[this.playing];
    const data = {
      type: "winner",
      body: {
        winner: player.id,
      },
    };
    this.sendToAll(data);
  }

  sendGameboard() {
    let gameboard = [];
    for (const [path, length] of this.ruleSet.pathLengths.entries()) {
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
      for (const [path, length] of this.ruleSet.pathLengths.entries()) {
        if (length == -1) {
          continue;
        }
        const j = length - player.state[path] - 1;
        if (j != -1) {
          gameboard[path][j].colors.push(n);
        }
      }
    }
    console.log(gameboard);
    const n = this.playing;
    const player = this.players[n];
    for (const [path, x] of player.temp.entries()) {
      if (x == 0) {
        continue;
      }
      const j = this.ruleSet.pathLengths[path] - player.state[path] - 1;
      for (let k = 1; k <= x; k++) {
        gameboard[path][j + k].colors.push(n);
        gameboard[path][j + k].hasTemp = true;
      }
    }
    let block = [];
    for (const [path, length] of this.ruleSet.pathLengths.entries()) {
      if (length == -1) {
        continue;
      }
      const n = this.isCompletedBy(path);
      if (n != null) {
        block.push({
          path: path,
          color: n,
        });
      }
    }
    const data = {
      type: "gameboard",
      body: {
        gameboard: gameboard,
        block: block,
      },
    };
    this.sendToAll(data);
  }

  handle(data) {
    console.log(`The server receives the following data:`);
    console.log(data);
    if (data.id != this.players[this.playing].id) {
      console.log(`Not Player ${data[id]}'s turn`);
      return;
    }
    switch (data.type) {
      case "start":
        this.handlerStart(data.body);
        break;
      case "roll":
        this.handlerRoll();
        break;
      case "action":
        this.handlerAction(data.body);
        break;
      case "lose":
        this.handlerLose();
        break;
      case "stop":
        this.handlerStop();
        break;
      case "continue":
        this.handlerContinue();
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
    for (let player of this.players) {
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
    const player = this.players[this.playing];
    const action = body.action;
    for (const path of action) {
      player.takeAction(path);
    }
    this.sendGameboard();
    this.sendContinue();
  }

  handlerLose() {
    const player = this.players[this.playing];
    player.addMoves(this.moveCount);
    player.resetTemp();
    this.sendGameboard();
    this.sendPlayer(false);
    this.nextPlayer();
  }

  handlerStop() {
    const player = this.players[this.playing];
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

  handlerContinue() {
    this.nextMove();
  }

  isCompletedBy(path) {
    for (const [n, player] of this.players.entries()) {
      if (player.state[path] == 0) {
        return n;
      }
    }
    return null;
  }

  isValidPath(path, player) {
    if (this.isCompletedBy(path) != null) {
      return false;
    }
    if (player.temp[path] > 0) {
      return player.state[path] > player.temp[path];
    }
    return player.numTemp() < this.ruleSet.numTemp;
  }

  isValidAction(action, player) {
    for (const [i, path] of action.entries()) {
      if (!this.isValidPath(path, player)) {
        for (let j = i - 1; j >= 0; j--) {
          player.undoAction(action[j]);
        }
        return false;
      }
      player.takeAction(path);
    }
    for (const path of action) {
      player.undoAction(path);
    }
    return true;
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
