import { initializeGameboard, updateSpace, blockPath } from "./gameboard.js";
import {
  clearFeed,
  postStart,
  postRoll,
  postDices,
  postOptions,
  postContinue,
  postTurnEnds,
  postWinner,
} from "./feed.js";
import {
  updateTurnCount,
  updateMoveCount,
  createPlayers,
  updatePlayer,
  resetSidePanel,
} from "./side_panel.js";

class Client {
  constructor(id, server) {
    this.id = id;
    this.server = server;
    this.connect();
  }

  connect() {
    console.log(`Connecting to the server...`);
    this.server.connect(this);
  }

  send(data) {
    this.server.handle(data);
  }

  sendStart(i) {
    const data = {
      id: this.id,
      type: "start",
      body: {
        ruleSet: i,
      },
    };
    this.send(data);
  }

  sendRoll() {
    const data = {
      id: this.id,
      type: "roll",
      body: null,
    };
    this.send(data);
  }

  sendAction(decision, action) {
    const data = {
      id: this.id,
      type: "action",
      body: {
        decision: decision,
        action: action,
      },
    };
    this.send(data);
  }

  handle(data) {
    console.log(`The client receives the following data:`);
    console.log(data);
    switch (data.type) {
      case "start":
        this.handlerStart(data.body);
        break;
      case "turnCount":
        this.handlerTurnCount(data.body);
        break;
      case "moveCount":
        this.handlerMoveCount(data.body);
        break;
      case "player":
        this.handlerPlayer(data.body);
        break;
      case "roll":
        this.handlerRoll();
        break;
      case "dices":
        this.handlerDices(data.body);
        break;
      case "winner":
        this.handlerWinner(data.body);
        break;
      case "gameboard":
        this.handlerGameboard(data.body);
        break;

      default:
        console.log("Unsupported type");
        break;
    }
  }

  handlerStart(body) {
    createPlayers(body.ids);
    initializeGameboard(body.pathLengths);
    clearFeed();
  }

  handlerTurnCount(body) {
    updateTurnCount(body.turnCount);
  }

  handlerPlayer(body) {
    updatePlayer(body.id, body.isPlaying, body.score);
  }

  handlerMoveCount(body) {
    updateMoveCount(body.moveCount);
  }

  handlerRoll() {
    clearFeed();
    postRoll(this.sendRoll.bind(this));
  }

  handlerDices(body) {
    const dices = body.dices;
    postDices(dices);
    postOptions(
      [
        [dices[0], dices[1]],
        [dices[2], dices[3]],
      ],
      body.options[0],
      this.sendAction.bind(this)
    );
    postOptions(
      [
        [dices[0], dices[2]],
        [dices[1], dices[3]],
      ],
      body.options[1],
      this.sendAction.bind(this)
    );
    postOptions(
      [
        [dices[0], dices[3]],
        [dices[1], dices[2]],
      ],
      body.options[2],
      this.sendAction.bind(this)
    );
    if (!body.hasOptions) {
      postTurnEnds(this.sendAction.bind(this));
    }
  }

  handlerWinner(body) {
    clearFeed();
    postWinner(body.winner);
  }

  handlerGameboard(body) {
    for (const [i, path] of body.gameboard.entries()) {
      if (path == null) {
        continue;
      }
      for (const [j, space] of path.entries()) {
        updateSpace(i, j, space.colors, space.hasTemp);
      }
    }
    for (const i of body.block) {
      blockPath(i, 0);
    }
    // this.sendToAll({
    //   type: "gameboard",
    //   body: {
    //     gameboard: gameboard,
    //     block: block,
    //   },
    // });
  }
}

export { Client };
