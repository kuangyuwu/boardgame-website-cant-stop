class Server {
  constructor() {
    this.clients = {};
    this.config = null;
  }

  connect(client) {
    this.clients[client.id] = client;
    console.log("Connected to the client");
  }

  send(data, id) {
    this.clients[id].handle(data);
  }

  sendToAll(data) {
    for (const id in this.clients) {
      this.send(data, id);
    }
  }

  handle(data) {
    console.log(`The server receives the following data:`);
    console.log(data);
    switch (data.type) {
      case "start":
        this.startGame(data.body);
        break;

      default:
        console.log(`Unsupported type`);
        break;
    }
  }

  startGame(body) {
    this.config = configs[body.config];
    this.sendToAll({
      type: "start",
      body: {
        pathLengths: this.config.pathLengths,
      },
    });
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

const configs = {
  0: {
    pathLengths: [-1, -1, 3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3],

    numTemp: 3,
    goal: 3,

    dices: [6, 6, 6, 6],
    partitions: [
      [
        [0, 1],
        [2, 3],
      ],
      [
        [0, 2],
        [1, 3],
      ],
      [
        [0, 3],
        [1, 2],
      ],
    ],
  },
};

export { Server, rollDices };
