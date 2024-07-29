function rollDices() {
  let dices = [];
  for (let i = 0; i < 4; i++) {
    const dice = Math.floor(Math.random() * 6) + 1;
    dices.push(dice);
  }
  dices.sort((a, b) => a - b);
  return dices;
}

export { rollDices };
