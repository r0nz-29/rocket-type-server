"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParagraph = exports.generateRoomId = void 0;
const faker_1 = require("@faker-js/faker");
function _newRoomId(length) {
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
function generateRoomId() {
    const id = _newRoomId(5);
    console.log("room created: " + id);
    return id;
}
exports.generateRoomId = generateRoomId;
function getParagraph() {
    return faker_1.faker.word.words(50);
}
exports.getParagraph = getParagraph;
//# sourceMappingURL=helpers.js.map