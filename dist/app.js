"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const socketControllers_1 = require("./socketControllers");
const app = (0, express_1.default)();
const PORT = 8080;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
app.use(error_handler_1.default);
const httpServer = http.createServer(app);
exports.ioServer = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["https://rocket-type-client.pages.dev/"]
    }
});
exports.ioServer.on("connection", socket => {
    (0, socketControllers_1.onConnect)(socket);
    socket.on("room:create", () => (0, socketControllers_1.createAndJoinRoom)(socket));
    socket.on("room:get-members", (args) => (0, socketControllers_1.getMembers)(args, socket));
    socket.on("room:join", (args) => (0, socketControllers_1.joinRoom)(args, socket));
    socket.on("game:countdown:start", (args) => (0, socketControllers_1.startCountdown)(args, socket));
    socket.on("game:start", (args) => (0, socketControllers_1.startGame)(args, socket));
    socket.on("game:result:sync", (args) => (0, socketControllers_1.collectResults)(args, socket));
    socket.on("disconnect", () => (0, socketControllers_1.disconnect)(socket));
});
// Start the server
httpServer.listen(PORT, () => {
    console.log(`Mongoose connected and Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map