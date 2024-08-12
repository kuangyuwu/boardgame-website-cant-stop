function logEvent(string) {
  const log = document.getElementById("log");
  const textNode = document.createTextNode(
    `[${new Date().toTimeString().slice(0, 8)}] ${string}`
  );
  const newLine = document.createElement("br");
  log.insertBefore(newLine, log.firstChild);
  log.insertBefore(textNode, log.firstChild);
}

export { logEvent };
