import { Client } from "./client.js";
import { Server } from "./server.js";
import { postCreateUser } from "./feed.js";
import { logEvent } from "./log.js";

function main() {
  postCreateUser((username) => {
    var client = new Client();
    client.username = username;
    client.createUser.bind(client)();
  });
  logEvent("adf;jepo a;wj3i");
  logEvent("123154125");
  logEvent("23094109671-3");
  logEvent("adf;jepo a;wj3i");
  logEvent("123154125");
  logEvent("23094109671-3");
  logEvent("adf;jepo a;wj3i");
  logEvent("123154125");
  logEvent("23094109671-3");
  logEvent("adf;jepo a;wj3i");
  logEvent("123154125");
  logEvent("23094109671-3");
}

main();
