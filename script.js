import { initGameboard } from "./gameboard.js";

function main() {
  console.log("abc");
  const pathLengths = [-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3];
  const gameboard = initGameboard(pathLengths);
}

main();
