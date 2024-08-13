function initializeGameboard(pathLengths) {
  const gameboard = document.getElementById("gameboard");
  gameboard.innerHTML = "";
  for (const [i, length] of pathLengths.entries()) {
    if (length < 0) {
      continue;
    }
    const pathOuter = document.createElement("div");
    pathOuter.setAttribute("class", "path-outer");
    const pathInner = document.createElement("div");
    pathInner.setAttribute("class", "path-inner");
    pathInner.setAttribute("id", `path-${i}`);
    const pathNameOuter = document.createElement("div");
    pathNameOuter.setAttribute("class", "path-name-outer");
    const pathName = document.createElement("div");
    pathName.setAttribute("class", "path-name");
    pathName.innerHTML = `${i}`;

    gameboard.appendChild(pathOuter);
    pathOuter.appendChild(pathInner);
    pathOuter.appendChild(pathNameOuter);
    pathNameOuter.appendChild(pathName);
    for (let j = length - 1; j >= 0; j--) {
      const space = document.createElement("div");
      space.setAttribute("class", "space");
      space.setAttribute("id", `space-${i}-${j}`);
      pathInner.appendChild(space);
    }
  }
}

function updateSpace(i, j, colors, hasTemp) {
  const space = document.getElementById(`space-${i}-${j}`);
  space.innerHTML = "";
  let position = "";
  switch (colors.length) {
    case 1:
      position = "singlet";
      break;
    case 2:
      position = "twin";
      break;
    case 3:
      position = "triplet";
      break;
    case 4:
      position = "quadruplet";
      break;
    case 5:
      position = "quintuplet";
      break;
    default:
      break;
  }
  for (const [index, color] of colors.entries()) {
    let marker = document.createElement("div");
    if (hasTemp && index == colors.length - 1) {
      marker.setAttribute("class", `marker-${color} ${position}-${index} temp`);
    } else {
      marker.setAttribute("class", `marker-${color} ${position}-${index}`);
    }
    space.appendChild(marker);
  }
}

function blockPath(i, color) {
  const path = document.getElementById(`path-${i}`);
  let spaces = path.childNodes;
  spaces.forEach((space) => {
    space.innerHTML = "";
    let marker = document.createElement("div");
    marker.setAttribute("class", `marker-${color} singlet-0`);
    space.appendChild(marker);
  });
}

export { initializeGameboard, updateSpace, blockPath };
