import { Client } from "./client.js";
import { postCreateUser } from "./feed.js";

function main() {
  postCreateUser((username) => {
    var client = new Client();
    client.username = username;
    client.createUser.bind(client)();
  });
}

main();
