import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { socketHandler } from "./socket/index.js";
import routes from "./routes/Routes.js";
import { initSocket } from "./socket/socketInstance.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());
app.use("/", routes);

connectDB();
initSocket(io)
socketHandler(io);

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
