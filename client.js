import { updateBoard } from "./board.js";
import {
  clearFeed,
  postCreateUser,
  postMode,
  postPrep,
  postPrepUpdate,
  postRoll,
  postDice,
  postAdvance,
  postWinner,
  postRetry,
} from "./feed.js";
import {
  updateTurn,
  updateMove,
  updateScoreBoard,
} from "./side_panel.js";
import { logMessage } from "./log.js";

class Client {
  constructor() {
    this.username = "";
    this.websocket = null;
    this.usernames = [];
    this.playerNow = 0;
    this.scores = [];
    this.mode = 0;
  }

  connect() {
    let websocket = new WebSocket(`wss://cant-stop-backend.kuangyuwu.com/websocket`);
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
      type: "start",
      body: null,
    };
    this.send(data);
  }

  sendUsername(username) {
    this.username = username;
    const data = {
      type: "username",
      body: username,
    };
    this.send(data);
  }

  sendPrepNew() {
    const data = {
      type: "newRoom",
      body: null,
    };
    this.send(data);
  }

  sendPrepJoin(roomId) {
    const data = {
      type: "joinRoom",
      body: roomId,
    };
    this.send(data);
  }

  sendPrepLeave() {
    const data = {
      type: "leaveRoom",
      body: null,
    };
    this.send(data);
  }

  sendPrepReady() {
    const data = {
      type: "ready",
      body: null,
    };
    this.send(data);
  }

  sendPrepUnready() {
    const data = {
      type: "unready",
      body: null,
    };
    this.send(data);
  }

  sendStartGame() {
    const data = {
      type: "startGame",
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

  sendAdvance(advance) {
    const data = {
      type: "advance",
      body: advance,
    };
    this.send(data);
  }

  sendStop() {
    const data = {
      type: "decision",
      body: false,
    };
    this.send(data);
  }

  sendContinue() {
    const data = {
      type: "decision",
      body: true,
    };
    this.send(data);
    this.sendRoll();
  }

  sendExitGame() {
    const data = {
      type: "exitGame",
      body: null,
    };
    this.send(data);
  }

  handle(data) {
    switch (data.type) {
      case "error":
        this.handleError(data.body);
        break;
      case "warn":
        this.handleWarn(data.body);
        break;
      case "username":
        this.handleUsername();
        break;
      case "mode":
        this.handleMode();
        break
      case "prep":
        this.handlePrep();
        break;
      case "prepUpdate":
        this.handlePrepUpdate(data.body);
        break;
      case "start":
        this.handleStart();
        break;
      case "usernames":
        this.handleUsernames(data.body);
        break;
      case "turn":
        this.handleTurn(data.body);
        break;
      case "player":
        this.handlePlayer(data.body);
        break;
      case "move":
        this.handleMove(data.body);
        break;
      case "scores":
        this.handleScores(data.body);
        break;
      case "roll":
        this.handleRoll();
        break;
      case "dice":
        this.handleDice(data.body);
        break;
      case "advance":
        this.handleAdvance(data.body);
        break;
      case "stop":
        this.handleStop();
        break;
      case "winner":
        this.handleWinner(data.body);
        break;
      case "board":
        this.handleBoard(data.body);
        break;

      default:
        console.log("Unsupported type");
        console.log(data);
        break;
    }
  }

  handleError(body) {
    console.error(body);
  }

  handleWarn(body) {
    console.warn(body)
  }

  handleUsername() {
    clearFeed();
    this.username = "";
    postCreateUser(this.sendUsername.bind(this));
  }

  handleMode() {
    postMode(this.send.bind(this), ((i) => { this.mode = i; }).bind(this));
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
      this.sendStartGame.bind(this),
      ...data.usernames
    );
  }

  handleStart() {
    logMessage("Game started!")
  }

  handleUsernames(body) {
    this.usernames = body;
    if (this.mode !== 1 && this.usernames.length === 1) {
      this.mode = 1;
      logMessage("Switched to single-player mode")
    }
  }

  handleTurn(body) {
    updateTurn(body);
  }

  handlePlayer(body) {
    this.playerNow = body - 1;
    updateScoreBoard(this.usernames, this.playerNow, this.scores);
  }

  handleMove(body) {
    updateMove(body);
  }
  
  handleScores(body) {
    this.scores = body;
    updateScoreBoard(this.usernames, this.playerNow, this.scores);
  }

  handleRoll() {
    clearFeed();
    const u = this.usernames[this.playerNow];
    postRoll(u === this.username, u, this.sendRoll.bind(this));
  }

  handleDice(body) {
    clearFeed();
    const u = this.usernames[this.playerNow];
    postDice(
      u === this.username,
      u,
      body.dice,
      body.options,
      body.failed,
      this.sendAdvance.bind(this),
      this.sendStop.bind(this),
    );
    logMessage(`${u} rolled ${body.dice.join()}`)
    if (body.failed) {
      logMessage(`${u} failed this turn`)
    }
  }

  handleAdvance(body) {
    clearFeed();
    const u = this.usernames[this.playerNow];
    postAdvance(
      u === this.username,
      u,
      body,
      this.sendContinue.bind(this),
      this.sendStop.bind(this)
    );
    logMessage(`${this.mode === 1 ? "You" : u} advanced ${body[0]}` + (body[1] !== 0 ? `,${body[1]}` : ""));
  }

  handleStop() {
    const u = this.usernames[this.playerNow];
    logMessage(`${this.mode === 1 ? "You" : u} decided to stop`)
  }

  handleWinner(body) {
    clearFeed();
    if (this.mode === 1) {
      postRetry(this.send.bind(this));
      logMessage("You reached the goal!");
    } else {
      const winner = this.usernames[body-1];
      postWinner(winner, this.send.bind(this));
      logMessage(`${winner} won the game!`);
    }
  }

  handleBoard(body) {
    updateBoard(body);
  }
}

export { Client };
