import {
  logToFeed,
  activityStart,
  activityRoll,
  activityDices,
} from "./feed.js";
import { Client } from "./client.js";
import { Server } from "./server.js";

import { addPlayers, updatePlayer } from "./side_panel.js";

function main() {
  console.log("abc");
  const server = new Server();
  const client = new Client("a", server);
  // server.send({ test1: "test1" }, "a");
  // client.send({ test2: "test" });

  logToFeed(activityStart(client));

  addPlayers(["a", "2", "iii"]);
  updatePlayer("2", true, 20);

  // logToFeed(activityRoll());
  // logToFeed(activityDices([1, 3, 5, 5]));
}

main();
