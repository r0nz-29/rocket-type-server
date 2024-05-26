import paragraphs from '../paragraphs.json';

function _newRoomId(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function generateRoomId() {
  const id = _newRoomId(5);
  console.log("room created: " + id);
  return id;
}

export function getParagraph() {
  const p1 = paragraphs[random(paragraphs.length)];
  const p2 = paragraphs[random(paragraphs.length)];
  return `${p1}. ${p2}`;
}

export function random(max: number) {
  const res = Math.floor(Math.random() * max);
  return Math.min(res, max - 1);
}
