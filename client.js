import { initializeGameboard, updateSpace, blockPath } from "./gameboard.js";
import {
  clearFeed,
  postPrep,
  postPrepUpdate,
  postStart,
  postRoll,
  postDices,
  postOptions,
  postContinue,
  postLose,
  postWinner,
  postCreateUser,
} from "./feed.js";
import {
  updateTurnCount,
  updateMoveCount,
  createPlayers,
  updatePlayer,
  resetSidePanel,
} from "./side_panel.js";
import { logEvent } from "./log.js";

class Client {
  constructor() {
    this.username = "";
    this.websocket = null;
  }

  createUser() {
    console.log(this.username);
    let websocket = new WebSocket(
      `wss://localhost:8080/v1/user/${this.username}`
    );
    websocket.onmessage = async (event) => {
      const text = await new Response(event.data).text();
      const data = JSON.parse(text);
      this.handle(data);
    };
    websocket.onopen = (_event) => {
      this.sendReady();
    };
    this.websocket = websocket;
  }

  send(data) {
    this.websocket.send(JSON.stringify(data));
  }

  sendReady() {
    const data = {
      type: "ready",
      body: null,
    };
    this.send(data);
  }

  sendPrepNew() {
    const data = {
      type: "prepNew",
      body: null,
    };
    this.send(data);
  }

  sendPrepJoin(roomId) {
    const data = {
      type: "prepJoin",
      body: {
        roomId: roomId,
      },
    };
    this.send(data);
  }

  sendPrepLeave() {
    const data = {
      type: "prepLeave",
      body: null,
    };
    this.send(data);
  }

  sendPrepReady() {
    const data = {
      type: "prepReady",
      body: null,
    };
    this.send(data);
  }

  sendPrepUnready() {
    const data = {
      type: "prepUnready",
      body: null,
    };
    this.send(data);
  }

  sendStart() {
    const data = {
      type: "start",
      body: null,
    };
    this.send(data);
  }

  // sendStart(i) {
  //   const data = {
  //     type: "start",
  //     body: {
  //       ruleSet: i,
  //     },
  //   };
  //   this.send(data);
  // }

  sendRoll() {
    const data = {
      type: "roll",
      body: null,
    };
    this.send(data);
  }

  sendAction(action) {
    const data = {
      type: "action",
      body: {
        action: action,
      },
    };
    this.send(data);
  }

  sendLose() {
    const data = {
      type: "lose",
      body: null,
    };
    this.send(data);
  }

  sendStop() {
    const data = {
      type: "stop",
      body: null,
    };
    this.send(data);
  }

  sendContinue() {
    const data = {
      type: "continue",
      body: null,
    };
    this.send(data);
  }

  handle(data) {
    console.log(`The client receives the following data:`);
    console.log(data);
    switch (data.type) {
      case "error":
        this.handleError(data.body);
        break;
      case "prep":
        this.handlePrep();
        break;
      case "prepUpdate":
        this.handlePrepUpdate(data.body);
        break;
      case "log":
        this.handleLog(data.body);
        break;
      case "start":
        this.handleStart(data.body);
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
      case "continue":
        this.handlerContinue();
        break;
      case "winner":
        this.handlerWinner(data.body);
        break;
      case "gameboard":
        this.handlerGameboard(data.body);
        break;

      default:
        console.log("Unsupported type");
        console.log(data);
        break;
    }
  }

  handleError(body) {
    console.log(body.error);
  }

  handlePrep() {
    clearFeed();
    postPrep(this.sendPrepNew.bind(this), this.sendPrepJoin.bind(this));
  }

  handlePrepUpdate(data) {
    clearFeed();
    postPrepUpdate(
      data.roomId,
      data.isHosting,
      data.isReady,
      this.sendPrepLeave.bind(this),
      this.sendPrepReady.bind(this),
      this.sendPrepUnready.bind(this),
      this.sendStart.bind(this),
      ...data.usernames
    );
  }

  handleLog(body) {
    logEvent(body.event);
  }

  handleStart(body) {
    createPlayers(body.usernames);
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
      postLose(this.sendLose.bind(this));
    }
  }

  handlerContinue() {
    postContinue(this.sendContinue.bind(this), this.sendStop.bind(this));
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
    for (const b of body.block) {
      blockPath(b.path, b.color);
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
