import {faker} from "@faker-js/faker";

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
  return faker.word.words(50);
}