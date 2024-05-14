"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.collectResults = exports.startGame = exports.startCountdown = exports.joinRoom = exports.getMembers = exports.createAndJoinRoom = exports.onConnect = void 0;
const temp_store_1 = require("../utils/temp-store");
const helpers_1 = require("../utils/helpers");
const app_1 = require("../app");
const GAME_DURATION = 50; // sec
function validUsername(username, socket) {
    if (!username || temp_store_1.usernameSocketIdMap[username]) {
        socket.emit("fail:username-exists");
        return false;
    }
    return true;
}
function onConnect(socket) {
    const username = socket.handshake.auth?.username;
    if (!validUsername(username, socket))
        return;
    temp_store_1.socketIdUsernameMap[socket.id] = username;
    temp_store_1.usernameSocketIdMap[username] = socket.id;
    console.log(temp_store_1.socketIdUsernameMap);
}
exports.onConnect = onConnect;
function createAndJoinRoom(socket) {
    const username = temp_store_1.socketIdUsernameMap[socket.id];
    if (!username) {
        socket.emit("fail:username-not-found");
        return;
    }
    const roomId = (0, helpers_1.generateRoomId)();
    socket.join(roomId);
    app_1.ioServer.in(roomId).emit("room:joined", { roomId, username });
}
exports.createAndJoinRoom = createAndJoinRoom;
function getMembers(roomId, socket) {
    if (!roomId) {
        socket.emit("fail:invalid-room");
        return;
    }
    const clientsInRoom = app_1.ioServer.sockets.adapter.rooms.get(roomId);
    if (!clientsInRoom) {
        socket.emit("fail:invalid-room");
        return;
    }
    console.log(clientsInRoom);
    const usernames = [];
    for (const sid of clientsInRoom) {
        usernames.push(temp_store_1.socketIdUsernameMap[sid]);
    }
    app_1.ioServer.in(roomId).emit("room:members", usernames);
}
exports.getMembers = getMembers;
function joinRoom({ roomId }, socket) {
    const username = temp_store_1.socketIdUsernameMap[socket.id];
    if (!username) {
        socket.emit("fail:username-exists");
        return;
    }
    if (!roomId || !app_1.ioServer.sockets.adapter.rooms.has(roomId)) {
        socket.emit("fail:invalid-room");
        return;
    }
    socket.join(roomId);
    app_1.ioServer.in(roomId).emit("room:joined", { roomId, username });
}
exports.joinRoom = joinRoom;
function startCountdown(roomId, socket) {
    const para = (0, helpers_1.getParagraph)();
    let countdown = 10;
    app_1.ioServer.in(roomId).emit("game:countdown:started", { para, countdown, duration: GAME_DURATION });
    const id = setInterval(() => {
        if (countdown <= 0) {
            app_1.ioServer.in(roomId).emit("game:countdown:end");
            clearInterval(id);
            startGame(roomId, socket);
            return;
        }
        countdown--;
        app_1.ioServer.in(roomId).emit("game:countdown:tick");
    }, 1000);
}
exports.startCountdown = startCountdown;
function startGame(roomId, socket) {
    let duration = GAME_DURATION; // sec
    const id = setInterval(() => {
        if (duration <= 0) {
            app_1.ioServer.in(roomId).emit("game:end");
            clearInterval(id);
            return;
        }
        --duration;
        app_1.ioServer.in(roomId).emit("game:tick");
    }, 1000);
}
exports.startGame = startGame;
function collectResults({ roomId, wpm, errors }, socket) {
    const username = temp_store_1.socketIdUsernameMap[socket.id];
    const prevResults = temp_store_1.roomIdResultsMap[roomId] || [];
    temp_store_1.roomIdResultsMap[roomId] = [...prevResults, { username, wpm, errors }];
    app_1.ioServer.in(roomId).emit("game:result:publish", temp_store_1.roomIdResultsMap[roomId]);
}
exports.collectResults = collectResults;
function disconnect(socket) {
    const username = temp_store_1.socketIdUsernameMap[socket.id];
    if (username)
        delete temp_store_1.usernameSocketIdMap[username];
    delete temp_store_1.socketIdUsernameMap[socket.id];
}
exports.disconnect = disconnect;
//# sourceMappingURL=index.js.map