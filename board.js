function updateBoard(board) {
  document.querySelectorAll(".board-inner").forEach((e) => {
    e.innerHTML = "";
    for (const [i, path] of board.entries()) {
      if (path === null) {
        continue;
      }
      const pathOuter = document.createElement("div");
      pathOuter.setAttribute("class", "path-outer");
      const pathInner = document.createElement("div");
      pathInner.setAttribute("class", "path-inner");
      const pathNameOuter = document.createElement("div");
      pathNameOuter.setAttribute("class", "path-name-outer");
      const pathName = document.createElement("div");
      pathName.setAttribute("class", "path-name");
      pathName.innerHTML = `${i}`;

      e.appendChild(pathOuter);
      pathOuter.appendChild(pathInner);
      pathOuter.appendChild(pathNameOuter);
      pathNameOuter.appendChild(pathName);
      for (const x of path) {
        const space = document.createElement("div");
        space.setAttribute("class", "space");
        let n = 0;
        for (let y = x; y > 0; y >>= 1) {
          n += y & 1;
        }
        let k = 0;
        for (let j = 0; j < 5; j++) {
          if ((x & (1 << j)) > 0) {
            let marker = document.createElement("div");
            marker.setAttribute("class", `marker-${j} marker-${n}-${k}`);
            space.appendChild(marker);
            k++;
          } else if ((x & (1 << (j + 5))) > 0) {
            let marker = document.createElement("div");
            marker.setAttribute("class", `marker-${j} marker-${n}-${k} temp`);
            space.appendChild(marker);
            k++;
          }
        }
        pathInner.appendChild(space);
      }
    }
  })
}

function emptyBoard() {
  updateBoard([
    null,
    null,
    [0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0],
  ]);
}

export { updateBoard, emptyBoard };
