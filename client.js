import { initGameboard } from "./gameboard.js";
import { clearFeed } from "./feed.js";
import {} from "./side_panel.js";

class Client {
  constructor(id, server) {
    this.id = id;
    this.server = server;
    this.connect();
  }

  connect() {
    console.log(`Connecting to the server...`);
    this.server.connect(this);
  }

  send(data) {
    this.server.handle(data);
  }

  handle(data) {
    console.log(`The client receives the following data:`);
    console.log(data);
    switch (data.type) {
      case "start":
        this.handlerStart(data.body);
        break;

      default:
        console.log("Unsupported type");
        break;
    }
  }

  handlerStart(body) {
    initGameboard(body.pathLengths);
    clearFeed();
  }
}

export { Client };
