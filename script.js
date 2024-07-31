import { Client } from "./client.js";
import { Server } from "./server.js";

import { initializeGameboard, updateSpace, blockPath } from "./gameboard.js";
import { createPlayers, updatePlayer, resetSidePanel } from "./side_panel.js";
import {
  postStart,
  postRoll,
  postDices,
  postOptions,
  postTurnEnds,
  postContinue,
  clearFeed,
} from "./feed.js";

function main() {
  console.log("abc");
  const server = new Server();
  const client = new Client("a", server);

  initializeGameboard([-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3]);
  updateSpace(3, 3, [1, 0], true);
  updateSpace(4, 4, [1, 2, 4], false);
  updateSpace(5, 5, [1, 2, 3, 4], true);
  updateSpace(6, 6, [1, 2, 3, 4, 0], false);
  updateSpace(7, 7, [0], false);
  blockPath(7, 3);
  updateSpace(7, 2, [], false);

  postStart(client);
  postRoll();
  postDices([1, 2, 3, 4, 5, 6]);
  postOptions([[1, 2], [3, 4], [5]], [[2, 6], [4], [2, 3, 10]]);
  postTurnEnds();
  postContinue();
}

main();
