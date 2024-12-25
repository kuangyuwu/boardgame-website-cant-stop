import { emptyBoard } from "./board.js";
import { Client } from "./client.js";
import { postConnect } from "./feed.js";

function main() {
  postConnect(() => {
    var client = new Client();
    client.connect.bind(client)();
  });
  emptyBoard();
}

main();
