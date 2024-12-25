function logMessage(msg) {
  document.querySelectorAll(".messages").forEach((e) => {
    const textNode = document.createTextNode(
      `[${new Date().toTimeString().slice(0, 8)}] ${msg}`
    );
    const newLine = document.createElement("br");
    e.insertBefore(newLine, e.firstChild)
    e.insertBefore(textNode, e.firstChild)
  })
}

export { logMessage };
