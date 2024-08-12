import { Client } from "./client.js";
import { Server } from "./server.js";
import { postCreateUser } from "./feed.js";

function main() {
  postCreateUser((username) => {
    var client = new Client();
    client.username = username;
    client.createUser.bind(client)();
  });
}

main();
