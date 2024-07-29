function initGameboard(pathLengths) {
  const gameboardHTMLNode = document.getElementById("gameboard");
  return new Gameboard(gameboardHTMLNode, pathLengths);
}

class Gameboard {
  constructor(gameboardHTMLNode, pathLengths) {
    this.htmlNode = gameboardHTMLNode;
    this.paths = [];
    for (const [i, length] of pathLengths.entries()) {
      if (length < 0) {
        this.paths.push(null);
      } else {
        const path = new Path(i, length);
        this.paths.push(path);
        this.htmlNode.appendChild(path.htmlNode);
      }
    }
  }
}

class Path {
  constructor(name, length) {
    const pathOuter = document.createElement("div");
    pathOuter.setAttribute("class", "path-outer");
    const pathInner = document.createElement("div");
    pathInner.setAttribute("class", "path-inner");
    const pathNameOuter = document.createElement("div");
    pathNameOuter.setAttribute("class", "path-name-outer");
    const pathName = document.createElement("div");
    pathName.setAttribute("class", "path-name");
    pathName.innerHTML = `${name}`;
    pathOuter.appendChild(pathInner);
    pathOuter.appendChild(pathNameOuter);
    pathNameOuter.appendChild(pathName);

    this.spaces = [null];
    for (let i = 1; i <= length; i++) {
      this.spaces.push(new Space());
      pathInner.appendChild(this.spaces[i].htmlNode);
    }
    this.htmlNode = pathOuter;
  }
}

class Space {
  constructor() {
    const space = document.createElement("div");
    space.setAttribute("class", "space");
    this.htmlNode = space;
  }
}

export { initGameboard };
