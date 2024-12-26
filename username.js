export function isValidUsername(username) {
  if (username.length == 0 || username.length > 10) return false;
  for (const c of username) {
    const code = c.charCodeAt(0);
    if (code >= 48 && code <= 57) continue;
    if (code >= 65 && code <= 90) continue;
    if (code >= 97 && code <= 122) continue;
    return false;
  }
  return true;
}

const animalNames = [
  "Beaver",
  "Camel",
  "Cobra",
  "Crane",
  "Crow",
  "Dolphin",
  "Eagle",
  "Eal",
  "Giraffe",
  "Hamster",
  "Hawk",
  "Hyena",
  "Koala",
  "Leopard",
  "Lobster",
  "Moose",
  "Ostrich",
  "Otter",
  "Panda",
  "Pelican",
  "Penguin",
  "Raven",
  "Rhino",
  "Toucan",
  "Whale",
]

export function randomUsername() {
  const i = Math.floor(Math.random() * 25);
  const k = Math.floor(Math.random() * 999) + 1;
  return `${animalNames[i]}${k}`;
}