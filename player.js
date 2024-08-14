// class Player {
//   constructor(client) {
//     this.id = client.id;
//     this.client = client;
//     this.totalMoves = 0;
//     this.state = [];
//     this.temp = [];
//   }

//   initialize(pathLengths) {
//     this.state = [...pathLengths];
//     this.temp = new Array(pathLengths.length).fill(0);
//   }

//   numTemp() {
//     let count = 0;
//     for (const x of this.temp) {
//       if (x > 0) {
//         count++;
//       }
//     }
//     return count;
//   }

//   takeAction(path) {
//     this.temp[path]++;
//   }

//   undoAction(path) {
//     this.temp[path]--;
//   }

//   updateState() {
//     for (const [path, progress] of this.temp.entries()) {
//       this.state[path] -= progress;
//     }
//   }

//   resetTemp() {
//     this.temp.fill(0);
//   }

//   addMoves(move) {
//     this.totalMoves += move;
//   }

//   score() {
//     let count = 0;
//     for (let x of this.state) {
//       if (x == 0) {
//         count++;
//       }
//     }
//     return count;
//   }

//   isWinner(goal) {
//     return this.score() >= goal;
//   }
// }

// export { Player };
