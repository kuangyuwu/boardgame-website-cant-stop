function clearFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
}

function clearFeedAnd(callback) {
  return () => {
    clearFeed();
    callback();
  };
}

function postToFeed(...innerHTMLNodes) {
  const feed = document.getElementById("feed");
  const activityOuter = document.createElement("div");
  activityOuter.setAttribute("class", "activity-outer");
  const activityInner = document.createElement("div");
  activityInner.setAttribute("class", "activity-inner");

  feed.appendChild(activityOuter);
  activityOuter.appendChild(activityInner);
  activityInner.append(...innerHTMLNodes);
}

function textNode(content) {
  const text = document.createElement("span");
  text.innerHTML = content;
  return text;
}

function buttonNode(buttonText, onClick) {
  const button = document.createElement("button");
  button.innerHTML = buttonText;
  button.onclick = () => {
    clearFeed();
    onClick();
  };
  return button;
}

function diceNode(point) {
  const dice = document.createElement("span");
  dice.setAttribute("class", `dice-${point}`);
  return dice;
}

function formNode(inputId, labelPrompt, buttonText, onSubmit) {
  const form = document.createElement("form");
  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelPrompt;
  const input = document.createElement("input");
  input.type = "text";
  input.id = inputId;
  input.name = inputId;
  input.required = true;
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = buttonText;
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(button);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = document.getElementById(inputId).value;
    clearFeed();
    onSubmit(value);
  });

  return form;
}

function postCreateUser(onSubmit) {
  postToFeed(formNode("username", "Enter your username:", "Submit", onSubmit));
}

function postPrep(sendPrepNew, sendPrepJoin) {
  postToFeed(buttonNode("Start a new game", sendPrepNew));
  postToFeed(
    formNode("game-id", "Enter game id to join: ", "Join", sendPrepJoin)
  );
}

function postPrepUpdate(
  gameId,
  isHosting,
  isReady,
  sendPrepLeave,
  sendPrepReady,
  sendPrepUnready,
  sendStart,
  ...usernames
) {
  if (isHosting) {
    postPrepHosting(gameId, sendPrepLeave);
    postPrepUsernames(...usernames);
    if (isReady) {
      postPrepStart(sendStart);
    }
  } else {
    postPrepJoined(gameId, sendPrepLeave);
    postPrepUsernames(...usernames);
    if (isReady) {
      postPrepReady(sendPrepUnready);
    } else {
      postPrepNotReady(sendPrepReady);
    }
  }
}

function postPrepHosting(gameId, sendPrepLeave) {
  postToFeed(
    textNode(`Hosting game room: ${gameId}`),
    buttonNode("Leave", sendPrepLeave)
  );
}

function postPrepJoined(gameId, sendPrepLeave) {
  postToFeed(
    textNode(`Game room: ${gameId}`),
    buttonNode("Leave", sendPrepLeave)
  );
}

function postPrepUsernames(...usernames) {
  postToFeed(textNode("Players: " + usernames.join(", ")));
}

function postPrepNotReady(sendPrepReady) {
  postToFeed(textNode("Ready to play?"), buttonNode("Start", sendPrepReady));
}

function postPrepReady(sendPrepUnready) {
  postToFeed(
    textNode("Ready to play, waiting for the host to start"),
    buttonNode("Cancel", sendPrepUnready)
  );
}

function postPrepStart(sendStart) {
  postToFeed(textNode("All players are ready"), buttonNode("Start", sendStart));
}

function postRoomDismissed() {
  postToFeed(textNode("The game was dismissed..."));
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
    nodes.push(diceNode(point));
  }
  postToFeed(nodes);
}

function postOptions(groups, options, sendAction) {
  let nodes = [];
  for (const [i, group] of groups.entries()) {
    for (const point of group) {
      nodes.push(diceNode(point));
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

export {
  clearFeed,
  postCreateUser,
  postPrep,
  postPrepUpdate,
  postStart,
  postRoll,
  postDices,
  postOptions,
  postContinue,
  postLose,
  postWinner,
};
