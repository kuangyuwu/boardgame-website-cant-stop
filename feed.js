let feedLocked = false;

function clearFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
}

function postToFeed(...innerHTMLNodes) {
  if (feedLocked) return;
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

function postConnect(onClick) {
  postToFeed(buttonNode("Start playing", onClick));
}

function postCreateUser(onSubmit) {
  postToFeed(formNode("username", "Enter a username:", "Submit", onSubmit));
}

function postPrep(sendPrepNew, sendPrepJoin) {
  postToFeed(buttonNode("Create a new room", sendPrepNew));
  postToFeed(
    formNode("room-id", "Enter room id to join: ", "Join", sendPrepJoin)
  );
}

function postChooseRuleset(rulesets, sendRuleset) {
  let nodes = [textNode("Choose a game mode: ")];
  for (const i of rulesets) {
    nodes.push(
      buttonNode(i + " dices", () => {
        feedLocked = false;
        sendRuleset(i);
      })
    );
  }
  feedLocked = false;
  postToFeed(...nodes);
  feedLocked = true;
}

function postPrepUpdate(
  roomId,
  ruleset,
  isHosting,
  isReady,
  sendRuleset,
  sendPrepLeave,
  sendPrepReady,
  sendPrepUnready,
  sendStart,
  ...usernames
) {
  if (isHosting) {
    postPrepHosting(roomId, sendPrepLeave);
    postRuleset(ruleset, isHosting, sendRuleset);
    postPrepUsernames(...usernames);
    if (isReady) {
      postPrepStart(sendStart);
    }
  } else {
    postPrepJoined(roomId, sendPrepLeave);
    postRuleset(ruleset, isHosting, sendRuleset);
    postPrepUsernames(...usernames);
    if (isReady) {
      postPrepReady(sendPrepUnready);
    } else {
      postPrepNotReady(sendPrepReady);
    }
  }
}

function postRuleset(ruleset, isHosting, sendRuleset) {
  if (ruleset == 0) {
    postToFeed(textNode("Game mode: choosing..."));
    return;
  }
  let nodes = [textNode(`Game mode: ${ruleset} dices`)];
  if (isHosting) {
    nodes.push(
      buttonNode("Change game mode", () => {
        sendRuleset(0);
      })
    );
  }
  postToFeed(...nodes);
}

function postPrepHosting(roomId, sendPrepLeave) {
  postToFeed(
    textNode(`Hosting room: ${roomId}`),
    buttonNode("Leave", sendPrepLeave)
  );
}

function postPrepJoined(roomId, sendPrepLeave) {
  postToFeed(
    textNode(`Room ID: ${roomId}`),
    buttonNode("Leave", sendPrepLeave)
  );
}

function postPrepUsernames(...usernames) {
  postToFeed(textNode("Players: " + usernames.join(", ")));
}

function postPrepNotReady(sendPrepReady) {
  postToFeed(textNode("Ready to play?"), buttonNode("Ready", sendPrepReady));
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

function postRoll(sendRoll) {
  postToFeed(textNode("Roll the dices:"), buttonNode("Roll", sendRoll));
}

function postPoints(points) {
  console.log(points);
  console.log(points.map(diceNode));
  postToFeed(textNode("Dices:&nbsp;"), ...points.map(diceNode));
}

function postOption(grouping, actions, sendAction) {
  let nodes = [];
  for (const [i, group] of grouping.entries()) {
    for (const point of group) {
      nodes.push(diceNode(point));
    }
    if (i != grouping.length - 1) {
      nodes.push(textNode("&nbsp;,&nbsp;"));
    } else {
      nodes.push(textNode("&nbsp;:&nbsp;"));
    }
  }
  if (actions.length == 0) {
    nodes.push(textNode("no valid options"));
  }
  for (const action of actions) {
    nodes.push(
      buttonNode("Advance " + action.join(), () => {
        sendAction(action);
      })
    );
  }
  postToFeed(...nodes);
}

function postContinue(sendContinue, sendStop) {
  postToFeed(
    textNode("Continue?&nbsp;"),
    buttonNode("Continue and roll", sendContinue),
    buttonNode("Stop", sendStop)
  );
}

function postFail(sendFail) {
  postToFeed(
    textNode("No valid actions, turn failed&nbsp;"),
    buttonNode("Ok", sendFail)
  );
}

function postWinner(username, sendEndGame) {
  postToFeed(
    textNode(`Game over, winner is ${username}`),
    buttonNode("OK", sendEndGame)
  );
}

export {
  clearFeed,
  postConnect,
  postCreateUser,
  postChooseRuleset,
  postPrep,
  postPrepUpdate,
  postRoll,
  postPoints,
  postOption,
  postContinue,
  postFail,
  postWinner,
};
