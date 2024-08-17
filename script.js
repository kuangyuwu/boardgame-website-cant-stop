import { Client } from "./client.js";
import { postConnect, postCreateUser } from "./feed.js";

function main() {
  postConnect(() => {
    var client = new Client();
    client.connect.bind(client)();
  });
  // postCreateUser((username) => {
  //   var client = new Client();
  //   client.username = username;
  //   client.createUser.bind(client)();
  // });
}

main();
