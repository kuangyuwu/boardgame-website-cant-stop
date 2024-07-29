import { rollDices } from "./server.js";

function clearFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
}

function logToFeed(innerHTMLNodes) {
  const feed = document.getElementById("feed");

  const activityOuter = document.createElement("div");
  activityOuter.setAttribute("class", "activity-outer");
  const activityInner = document.createElement("div");
  activityInner.setAttribute("class", "activity-inner");
  activityOuter.appendChild(activityInner);
  for (const node of innerHTMLNodes) {
    activityInner.appendChild(node);
  }

  feed.append(activityOuter);
}

function activityStart(client) {
  const startPrompt = document.createElement("span");
  startPrompt.innerHTML = "Start a new game:&nbsp;";
  let nodes = [startPrompt];
  for (let i = 0; i < 1; i++) {
    let startButton = document.createElement("button");
    startButton.innerHTML = "Start";
    startButton.onclick = () => {
      client.send({
        type: "start",
        body: {
          config: i,
        },
      });
    };
    nodes.push(startButton);
  }
  return nodes;
}

function activityRoll() {
  const rollPrompt = document.createElement("span");
  rollPrompt.innerHTML = "Roll the dices:&nbsp;";
  const rollButton = document.createElement("button");
  rollButton.innerHTML = "Roll";
  rollButton.onclick = () => {
    // clearActivityFeed();
    logToFeed(activityDices(rollDices()));
  };
  return [rollPrompt, rollButton];
}

function activityDices(points) {
  const text = document.createElement("span");
  text.innerHTML = "Dices:&nbsp;";
  const dices = [text];
  for (const point of points) {
    dices.push(dice(point));
  }
  return dices;
}

function dice(point) {
  const dice = document.createElement("span");
  dice.setAttribute("class", `dice-${point}`);
  return dice;
}

export { clearFeed, logToFeed, activityStart, activityRoll, activityDices };
