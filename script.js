import { initGameboard } from "./gameboard.js";
import {
  clearActivityFeed,
  logActivity,
  activityRoll,
  activityDices,
} from "./activity_feed.js";
import { Server } from "./server.js";

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

  handle(data) {
    console.log(`The client receives the following data:`);
    console.log(data);
    return;
  }
}

function main() {
  console.log("abc");
  const server = new Server();
  const client = new Client("a", server);
  server.send({ test1: "test1" }, "a");
  client.send({ test2: "test" });

  const pathLengths = [-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3];
  const gameboard = initGameboard(pathLengths);

  logActivity(activityRoll());
  logActivity(activityDices([1, 3, 5, 5]));
}

main();
