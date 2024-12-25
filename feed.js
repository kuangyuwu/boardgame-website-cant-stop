function clearFeed() {
  document.querySelectorAll(".feed").forEach((e) => {
    e.innerHTML = "";
  })
}

function postToFeed(children) {
  document.querySelectorAll(".feed").forEach((e) => {
    const activityOuter = document.createElement("div");
    activityOuter.setAttribute("class", "activity-outer");
    const activityInner = document.createElement("div");
    activityInner.setAttribute("class", "activity-inner");
    activityOuter.appendChild(activityInner);
    activityInner.append(...children());
    e.appendChild(activityOuter);
  })
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
  input.autocomplete = "off";
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
  const children = () => [buttonNode("Start playing", onClick)];
  postToFeed(children);
}

function postCreateUser(onSubmit) {
  let i = 0;
  const children = () => {
    i++;
    return [formNode(`username-${i}`, "Enter a username:", "Submit", onSubmit)]
  };
  postToFeed(children);
}

function postPrep(sendPrepNew, sendPrepJoin) {
  let i = 0;
  const children1 = () => [buttonNode("Create a new room", sendPrepNew)]
  const children2 = () => {
    i++;
    return [formNode(`room-id-${i}`, "Enter room id to join: ", "Join", sendPrepJoin)];
  };
  postToFeed(children1);
  postToFeed(children2);
}

function postPrepUpdate(
  roomId,
  isHosting,
  isReady,
  sendPrepLeave,
  sendPrepReady,
  sendPrepUnready,
  sendStart,
  ...usernames
) {
  if (isHosting) {
    postPrepHosting(roomId, sendPrepLeave);
    postPrepUsernames(...usernames);
    if (isReady) {
      postPrepStart(sendStart);
    }
  } else {
    postPrepJoined(roomId, sendPrepLeave);
    postPrepUsernames(...usernames);
    if (isReady) {
      postPrepReady(sendPrepUnready);
    } else {
      postPrepNotReady(sendPrepReady);
    }
  }
}

function postPrepHosting(roomId, sendPrepLeave) {
  const children = () => [
    textNode(`Hosting room: ${roomId}`),
    buttonNode("Leave", sendPrepLeave),
  ];
  postToFeed(children);
}

function postPrepJoined(roomId, sendPrepLeave) {
  const children = () => [
    textNode(`Room ID: ${roomId}`),
    buttonNode("Leave", sendPrepLeave),
  ];
  postToFeed(children);
}

function postPrepUsernames(...usernames) {
  const children = () => [textNode("Players: " + usernames.join(", "))];
  postToFeed(children);
}

function postPrepNotReady(sendPrepReady) {
  const children = () => [
    textNode("Ready to play?"),
    buttonNode("Ready", sendPrepReady)
  ];
  postToFeed(children);
}

function postPrepReady(sendPrepUnready) {
  const children = () => [
    textNode("Ready to play, waiting for the host to start"),
    buttonNode("Cancel", sendPrepUnready)
  ];
  postToFeed(children);
}

function postPrepStart(sendStart) {
  const children = () => [
    textNode("All players are ready"),
    buttonNode("Start", sendStart),
  ];
  postToFeed(children);
}

function postRoll(isPlaying, username, sendRoll) {
  let children = () => {};
  if (isPlaying) {
    children = () => [
      textNode("Roll the dice:"),
      buttonNode("Roll", sendRoll)
    ];
  } else {
    children = () => [textNode(`${username} is rolling the dice...`)];
  }
  postToFeed(children);
}

function postDice(isPlaying, username, dice, options, failed, sendAdvance, sendFail) {
  postToFeed(() => {
    return [
      textNode(`${isPlaying ? "You" : username} rolled:&nbsp;`),
      ...dice.map(diceNode)
    ];
  });
  const groupingNodes = (i0, i1, i2, i3) => [
    diceNode(dice[i0]),
    diceNode(dice[i1]),
    textNode("&nbsp;,&nbsp;"),
    diceNode(dice[i2]),
    diceNode(dice[i3]),
    textNode("&nbsp;:&nbsp;"),
  ];
  for (let i = 0; i < 3; i++) {
    postToFeed(() => {
      let nodes = [];
      nodes.push(...groupingNodes(0, i + 1, Math.floor((4-i)/2), Math.floor((7-i)/2)));
      if (options[i][0][0] === 0) {
        nodes.push(textNode("no valid options"));
      } else {
        nodes.push(textNode("Advance&nbsp;"));
        if (options[i][0][1] !== 0) {
          const text = `${options[i][0][0]},${options[i][0][1]}`;
          nodes.push(
            isPlaying ?
            buttonNode(text, () => { sendAdvance(options[i][0]); }):
            textNode(text)
          );
        } else {
          const text = `${options[i][0][0]}`;
          nodes.push(
            isPlaying ?
            buttonNode(text, () => { sendAdvance(options[i][0]); }):
            textNode(text)
          );
          if (options[i][1][0] !== 0) {
            nodes.push(textNode("&nbsp;or&nbsp;"));
            const text = `${options[i][1][0]}`;
            nodes.push(
              isPlaying ?
              buttonNode(text, () => { sendAdvance(options[i][1]); }):
              textNode(text)
            );
          }
        }
      }
      return nodes;
    });
  }
  if (failed) {
    postToFeed(() => (
      isPlaying ?
      [textNode("Turn failed&nbsp;"), buttonNode("Ok", sendFail)] :
      [textNode("Turn failed")]
    ));
  }
}

function postAdvance(isPlaying, username, advance, sendContinue, sendStop) {
  if (isPlaying) {
    postToFeed(() => [
      textNode("Continue?&nbsp;"),
      buttonNode("Continue and roll", sendContinue),
      buttonNode("Stop", sendStop)
    ])
  } else {
    postToFeed(() => {
      const text = (
        advance[1] > 0 ?
        `${username} advanced ${advance[0]} & ${advance[1]}` :
        `${username} advanced ${advance[0]}`
      );
      return [textNode(text)]
    })
  }
}

function postWinner(username, sendExitGame) {
  const children = () => [
    textNode(`Game over, ${username} won the game!`),
    buttonNode("OK", sendExitGame)
  ];
  postToFeed(children);
}

export {
  clearFeed,
  postConnect,
  postCreateUser,
  postPrep,
  postPrepUpdate,
  postRoll,
  postDice,
  postAdvance,
  postWinner,
};
