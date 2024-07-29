import { initGameboard } from "./gameboard.js";
import {
  clearActivityFeed,
  postActivity,
  activityRoll,
  activityDices,
} from "./activity_feed.js";

function main() {
  console.log("abc");
  const pathLengths = [-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3];
  const gameboard = initGameboard(pathLengths);

  postActivity(activityRoll());
  postActivity(activityDices([1, 3, 5, 5]));
}

main();
