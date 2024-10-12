import { initializeGameboard, updateSpace, blockPath } from "./gameboard.js";
import {
  clearFeed,
  postChooseRuleset,
  postPrep,
  postPrepUpdate,
  postRoll,
  postPoints,
  postOption,
  postContinue,
  postFail,
  postWinner,
  postCreateUser,
} from "./feed.js";
import {
  updateTurnCount,
  updateMoveCount,
  createPlayers,
  updatePlayer,
} from "./side_panel.js";
import { logEvent } from "./log.js";

class Client {
  constructor() {
    this.username = "";
    this.choosingRuleset = false;
    this.websocket = null;
  }

  connect() {
    let websocket = new WebSocket(`ws://cant-stop-backend.kuangyuwu.com`);
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

  sendUsername(username) {
    const data = {
      type: "username",
      body: {
        username: username,
      },
    };
    this.send(data);
  }

  sendRuleset(ruleset) {
    const data = {
      type: "ruleset",
      body: {
        ruleset: ruleset,
      },
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

  sendRoll() {
    const data = {
      type: "roll",
      body: null,
    };
    this.send(data);
  }

  sendAction(action) {
    const data = {
      type: "act",
      body: {
        action: action,
      },
    };
    this.send(data);
  }

  sendFail() {
    const data = {
      type: "confirm",
      body: {
        willContinue: false,
      },
    };
    this.send(data);
  }

  sendStop() {
    const data = {
      type: "confirm",
      body: {
        willContinue: false,
      },
    };
    this.send(data);
  }

  sendContinue() {
    const data = {
      type: "confirm",
      body: {
        willContinue: true,
      },
    };
    this.send(data);
  }

  sendEndGame() {
    const data = {
      type: "exit",
      body: null,
    };
    this.send(data);
  }

  handle(data) {
    switch (data.type) {
      case "error":
        this.handleError(data.body);
        break;
      case "username":
        this.handleUsername();
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
        this.handleTurnCount(data.body);
        break;
      case "moveCount":
        this.handleMoveCount(data.body);
        break;
      case "player":
        this.handlePlayer(data.body);
        break;
      case "roll":
        this.handleRoll();
        break;
      case "result":
        this.handleResult(data.body);
        break;
      case "confirm":
        this.handleContinue();
        break;
      case "winner":
        this.handleWinner(data.body);
        break;
      case "gameboard":
        this.handleGameboard(data.body);
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

  handleUsername() {
    clearFeed();
    postCreateUser(this.sendUsername.bind(this));
  }

  handlePrep() {
    clearFeed();
    postPrep(this.sendPrepNew.bind(this), this.sendPrepJoin.bind(this));
  }

  handlePrepUpdate(data) {
    clearFeed();
    if (data.ruleset == 0 && data.isHosting) {
      postChooseRuleset([2, 3, 4], this.sendRuleset.bind(this));
      return;
    }
    postPrepUpdate(
      data.roomId,
      data.ruleset,
      data.isHosting,
      data.isReady,
      this.sendRuleset.bind(this),
      this.sendPrepLeave.bind(this),
      this.sendPrepReady.bind(this),
      this.sendPrepUnready.bind(this),
      this.sendStart.bind(this),
      ...data.usernames
    );
  }

  handleLog(body) {
    logEvent(body.content);
  }

  handleStart(body) {
    createPlayers(body.usernames);
    initializeGameboard(body.pathLengths);
    clearFeed();
  }

  handleTurnCount(body) {
    updateTurnCount(body.turnCount);
  }

  handlePlayer(body) {
    updatePlayer(body.username, body.isPlaying, body.score);
  }

  handleMoveCount(body) {
    updateMoveCount(body.moveCount);
  }

  handleRoll() {
    clearFeed();
    postRoll(this.sendRoll.bind(this));
  }

  handleResult(body) {
    clearFeed();
    postPoints(body.points);
    for (const option of body.options) {
      postOption(option.grouping, option.actions, this.sendAction.bind(this));
    }
    if (body.failed) {
      postFail(this.sendFail.bind(this));
    }
  }

  handleContinue() {
    clearFeed();
    postContinue(this.sendContinue.bind(this), this.sendStop.bind(this));
  }

  handleWinner(body) {
    clearFeed();
    postWinner(body.winner, this.sendEndGame.bind(this));
  }

  handleGameboard(body) {
    for (const [i, path] of body.gameboard.entries()) {
      if (path.length == 0) {
        continue;
      }
      for (const [j, space] of path.entries()) {
        updateSpace(i, j, space.colors, space.hasTemp);
      }
    }
    for (const b of body.blockedPaths) {
      blockPath(b.path, b.color);
    }
  }
}

export { Client };
