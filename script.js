import {
  logToFeed,
  activityStart,
  activityRoll,
  activityDices,
} from "./feed.js";
import { Client } from "./client.js";
import { Server } from "./server.js";

import { initializeGameboard, updateSpace, blockPath } from "./gameboard.js";
import { createPlayers, updatePlayer, resetSidePanel } from "./side_panel.js";

function main() {
  console.log("abc");
  const server = new Server();
  const client = new Client("a", server);

  initializeGameboard([-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3]);
  updateSpace(3, 3, [1, 5], true);
  updateSpace(4, 4, [1, 2, 4], false);
  updateSpace(5, 5, [1, 2, 3, 4], true);
  updateSpace(6, 6, [1, 2, 3, 4, 5], false);
  updateSpace(7, 7, [5], false);
  blockPath(7, 3);

  // server.send({ test1: "test1" }, "a");
  // client.send({ test2: "test" });

  // logToFeed(activityStart(client));

  // createPlayers(["a", "2", "iii"]);
  // updatePlayer("2", true, 20);
  // resetSidePanel();

  // logToFeed(activityRoll());
  // logToFeed(activityDices([1, 3, 5, 5]));
}

main();
