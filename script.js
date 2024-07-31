import { Client } from "./client.js";
import { Server } from "./server.js";
import { postStart } from "./feed.js";

function main() {
  console.log("abc");
  const server = new Server();
  const client1 = new Client("a", server);
  // const client2 = new Client("b", server);
  postStart(client1.sendStart.bind(client1));
}

main();
