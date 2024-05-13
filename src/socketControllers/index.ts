import {Socket} from "socket.io";
import {roomIdResultsMap, socketIdUsernameMap, usernameSocketIdMap} from "../utils/temp-store";
import {generateRoomId, getParagraph} from "../utils/helpers";
import {ioServer} from "../app";

const GAME_DURATION = 50; // sec

function validUsername(username: string, socket: Socket) {
  if (!username || usernameSocketIdMap[username]) {
    socket.emit("fail:username-exists");
    return false;
  }
  return true;
}

export function onConnect(socket: Socket) {
  const username = socket.handshake.auth?.username;
  if (!validUsername(username, socket)) return;

  socketIdUsernameMap[socket.id] = username;
  usernameSocketIdMap[username] = socket.id;
  console.log(socketIdUsernameMap);
}

export function createAndJoinRoom(socket: Socket) {
  const username = socketIdUsernameMap[socket.id];
  if (!username) {
    socket.emit("fail:username-not-found");
    return;
  }

  const roomId = generateRoomId();
  socket.join(roomId);
  ioServer.in(roomId).emit("room:joined", {roomId, username});
}

export function getMembers(roomId: string, socket: Socket) {
  if (!roomId) {
    socket.emit("fail:invalid-room");
    return;
  }

  const clientsInRoom = ioServer.sockets.adapter.rooms.get(roomId);
  if (!clientsInRoom) {
    socket.emit("fail:invalid-room");
    return;
  }

  console.log(clientsInRoom);
  const usernames = [];

  for (const sid of clientsInRoom) {
    usernames.push(socketIdUsernameMap[sid as keyof typeof socketIdUsernameMap]);
  }

  ioServer.in(roomId).emit("room:members", usernames);
}

export function joinRoom({roomId}, socket: Socket) {
  const username = socketIdUsernameMap[socket.id];
  if (!username) {
    socket.emit("fail:username-exists");
    return;
  }

  if (!roomId || !ioServer.sockets.adapter.rooms.has(roomId)) {
    socket.emit("fail:invalid-room");
    return;
  }

  socket.join(roomId);
  ioServer.in(roomId).emit("room:joined", {roomId, username});
}

export function startCountdown(roomId: string, socket: Socket) {
  const para = getParagraph();
  let countdown = 10;

  ioServer.in(roomId).emit("game:countdown:started", {para, countdown, duration: GAME_DURATION});

  const id = setInterval(() => {
    if (countdown <= 0) {
      ioServer.in(roomId).emit("game:countdown:end");
      clearInterval(id);
      startGame(roomId, socket);
      return;
    }
    countdown--;
    ioServer.in(roomId).emit("game:countdown:tick");
  }, 1000);
}

export function startGame(roomId: string, socket: Socket) {
  let duration = GAME_DURATION; // sec

  const id = setInterval(() => {
    if (duration <= 0) {
      ioServer.in(roomId).emit("game:end");
      clearInterval(id);
      return;
    }

    --duration;
    ioServer.in(roomId).emit("game:tick");
  }, 1000);
}

export function collectResults({roomId, wpm, errors}, socket: Socket) {
  const username = socketIdUsernameMap[socket.id];
  const prevResults = roomIdResultsMap[roomId] || [];
  roomIdResultsMap[roomId] = [...prevResults, {username, wpm, errors}];

  ioServer.in(roomId).emit("game:result:publish", roomIdResultsMap[roomId]);
}

export function disconnect(socket: Socket) {
  const username = socketIdUsernameMap[socket.id];
  if (username) delete usernameSocketIdMap[username];
  delete socketIdUsernameMap[socket.id];
}