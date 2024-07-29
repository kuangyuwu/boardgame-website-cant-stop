class Server {
  constructor() {
    this.clients = {};
  }

  connect(client) {
    this.clients[client.id] = client;
    console.log("Connected to the client");
  }

  send(data, clientId) {
    this.clients[clientId].handle(data);
  }

  handle(data) {
    console.log(`The server receives the following data:`);
    console.log(data);
  }
}

function rollDices() {
  let dices = [];
  for (let i = 0; i < 4; i++) {
    const dice = Math.floor(Math.random() * 6) + 1;
    dices.push(dice);
  }
  dices.sort((a, b) => a - b);
  return dices;
}

export { Server, rollDices };
