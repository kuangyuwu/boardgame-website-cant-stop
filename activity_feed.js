import { rollDices } from "./game_play.js";

function clearActivityFeed() {
  const activityFeed = document.getElementById("activity-feed");
  activityFeed.innerHTML = "";
}

function postActivity(innerHTMLNodes) {
  const activityFeed = document.getElementById("activity-feed");

  const activityOuter = document.createElement("div");
  activityOuter.setAttribute("class", "activity-outer");
  const activityInner = document.createElement("div");
  activityInner.setAttribute("class", "activity-inner");
  activityOuter.appendChild(activityInner);
  for (const node of innerHTMLNodes) {
    activityInner.appendChild(node);
  }

  activityFeed.append(activityOuter);
}

function activityRoll() {
  const rollPrompt = document.createElement("span");
  rollPrompt.innerHTML = "Roll the dices:&nbsp;";
  const rollButton = document.createElement("button");
  rollButton.innerHTML = "Roll";
  rollButton.onclick = () => {
    // clearActivityFeed();
    postActivity(activityDices(rollDices()));
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

export { clearActivityFeed, postActivity, activityRoll, activityDices };
