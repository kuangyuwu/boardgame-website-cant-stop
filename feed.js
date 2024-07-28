function clearFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
}

function postToFeed(innerHTMLNodes) {
  const feed = document.getElementById("feed");
  const activityOuter = document.createElement("div");
  activityOuter.setAttribute("class", "activity-outer");
  const activityInner = document.createElement("div");
  activityInner.setAttribute("class", "activity-inner");

  feed.appendChild(activityOuter);
  activityOuter.appendChild(activityInner);
  for (const node of innerHTMLNodes) {
    activityInner.appendChild(node);
  }
}

function postStart(sendStart) {
  let nodes = [];
  const startPrompt = document.createElement("span");
  startPrompt.innerHTML = "Start a new game:&nbsp;";
  nodes.push(startPrompt);
  for (let i = 0; i < 1; i++) {
    let startButton = document.createElement("button");
    startButton.innerHTML = "Start";
    startButton.onclick = () => {
      sendStart(i);
    };
    nodes.push(startButton);
  }
  postToFeed(nodes);
}

function postRoll(sendRoll) {
  let nodes = [];
  const rollPrompt = document.createElement("span");
  rollPrompt.innerHTML = "Roll the dices:&nbsp;";
  nodes.push(rollPrompt);
  const rollButton = document.createElement("button");
  rollButton.innerHTML = "Roll";
  rollButton.onclick = () => {
    sendRoll();
  };
  nodes.push(rollButton);
  postToFeed(nodes);
}

function postDices(points) {
  clearFeed();
  let nodes = [];
  const text = document.createElement("span");
  text.innerHTML = "Dices:&nbsp;";
  nodes.push(text);
  for (const point of points) {
    nodes.push(dice(point));
  }
  postToFeed(nodes);
}

function postOptions(groups, options, sendAction) {
  let nodes = [];
  for (const [i, group] of groups.entries()) {
    for (const point of group) {
      nodes.push(dice(point));
    }
    if (i != groups.length - 1) {
      let text = document.createElement("span");
      text.innerHTML = "&nbsp;,&nbsp;";
      nodes.push(text);
    } else {
      let text = document.createElement("span");
      text.innerHTML = "&nbsp;:&nbsp;";
      nodes.push(text);
    }
  }
  for (const option of options) {
    const optionButton = document.createElement("button");
    optionButton.innerHTML = "Advance " + option.join();
    optionButton.onclick = () => {
      sendAction(option);
    };
    nodes.push(optionButton);
    const blank = document.createElement("span");
    blank.innerHTML = "&nbsp;";
    nodes.push(blank);
  }
  postToFeed(nodes);
}

function postContinue(sendContinue, sendStop) {
  clearFeed();
  let nodes = [];
  const continuePrompt = document.createElement("span");
  continuePrompt.innerHTML = "Continue?&nbsp;";
  nodes.push(continuePrompt);
  const continueButton = document.createElement("button");
  continueButton.innerHTML = "Continue";
  continueButton.onclick = () => {
    sendContinue();
  };
  nodes.push(continueButton);
  const blank = document.createElement("span");
  blank.innerHTML = "&nbsp;";
  nodes.push(blank);
  const stopButton = document.createElement("button");
  stopButton.innerHTML = "Stop";
  stopButton.onclick = () => {
    sendStop();
  };
  nodes.push(stopButton);
  postToFeed(nodes);
}

function postLose(sendLose) {
  let nodes = [];
  const text = document.createElement("span");
  text.innerHTML = "No valid actions: turn ends&nbsp;";
  nodes.push(text);
  const okButton = document.createElement("button");
  okButton.innerHTML = "Ok";
  okButton.onclick = () => {
    sendLose();
  };
  nodes.push(okButton);
  postToFeed(nodes);
}

function postWinner(id) {
  let nodes = [];
  const text = document.createElement("span");
  text.innerHTML = `Winner is ${id}`;
  nodes.push(text);
  postToFeed(nodes);
}

function dice(point) {
  const dice = document.createElement("span");
  dice.setAttribute("class", `dice-${point}`);
  return dice;
}

export {
  clearFeed,
  postStart,
  postRoll,
  postDices,
  postOptions,
  postContinue,
  postLose,
  postWinner,
};
