import { initGameboard } from "./gameboard.js";
import {
  logToFeed,
  activityStart,
  activityRoll,
  activityDices,
} from "./feed.js";
import { Client } from "./client.js";
import { Server } from "./server.js";

function main() {
  console.log("abc");
  const server = new Server();
  const client = new Client("a", server);
  // server.send({ test1: "test1" }, "a");
  // client.send({ test2: "test" });

  logToFeed(activityStart(client));

  // const pathLengths = [-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3];
  // const gameboard = initGameboard(pathLengths);

  // logToFeed(activityRoll());
  // logToFeed(activityDices([1, 3, 5, 5]));
}

main();
