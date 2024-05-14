import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import * as http from "http";
import {Server} from "socket.io";
import ErrorHandler from "./middleware/error-handler";
import {
  collectResults,
  createAndJoinRoom,
  disconnect,
  getMembers,
  joinRoom,
  onConnect,
  startCountdown,
  startGame,
} from "./socketControllers";

const app = express();

const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("health check");
});

app.use(ErrorHandler);

const httpServer = http.createServer(app);

export const ioServer = new Server(httpServer, {
  cors: {
    origin: ["https://rocket-type-client.pages.dev/"]
  }
});

ioServer.on("connection", socket => {
  onConnect(socket);
  socket.on("room:create", () => createAndJoinRoom(socket));
  socket.on("room:get-members", (args) => getMembers(args, socket));
  socket.on("room:join", (args) => joinRoom(args, socket));
  socket.on("game:countdown:start", (args) => startCountdown(args, socket));
  socket.on("game:start", (args) => startGame(args, socket));
  socket.on("game:result:sync", (args) => collectResults(args, socket));
  socket.on("disconnect", () => disconnect(socket));
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Mongoose connected and Server is running on port ${PORT}`);
});