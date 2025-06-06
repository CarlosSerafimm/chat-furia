import Message from "../models/Message.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { chatCommands } from "../utils/chatCommands.js";

const usuarios = new Map();
const activeUsers = new Set();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado");

    socket.on("login", async ({ username, password }, callback) => {
      console.log("Username recebido:", username);
      console.log("Password recebido:", password);

      try {
        const user = await User.findOne({ username });
        if (!user)
          return callback?.({
            success: false,
            message: "Usuário não encontrado",
          });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return callback?.({ success: false, message: "Senha incorreta" });

        usuarios.set(username, socket.id);
        socket.username = username;

        callback?.({ success: true });

        if (!socket.hasLoggedIn) {
          socket.hasLoggedIn = true;
          const botMessage = {
            sender: "BOT FURIA",
            message: `${username} entrou no chat`,
            type: "bot",
            timestamp: new Date(),
          };

          io.emit("message", botMessage);
          await Message.create(botMessage);
        }
      } catch (err) {
        console.error("Erro no login:", err);
        callback?.({ success: false, message: "Erro ao fazer login" });
      }
    });

    socket.on("chatMessage", async (msg) => {
      try {
        const isCommand = msg.startsWith("/");
        const message = new Message({
          sender: socket.username,
          message: msg,
          type: isCommand ? "command" : "text",
        });
        await message.save();
        io.emit("message", message);

        if (isCommand && chatCommands[msg]) {
          const response =
            typeof chatCommands[msg].response === "function"
              ? await chatCommands[msg].response()
              : chatCommands[msg].response;
          const botResponse = {
            sender: "BOT FURIA",
            message: typeof response === "object" ? response.message : response,
            type: typeof response === "object" ? response.type : "bot",
            timestamp: new Date(),
          };

          io.emit("message", botResponse);
          await Message.create(botResponse);
        }
      } catch (err) {
        console.error("Erro ao salvar mensagem:", err);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Algum usuário desconectou");
      if (socket.username) {
        console.log("Usuário " + socket.username + " desconectado");
        activeUsers.delete(socket.username);

        const botMessage = {
          sender: "BOT FURIA",
          message: `${socket.username} saiu do chat`,
          type: "bot",
          timestamp: new Date(),
        };

        io.emit("message", botMessage);
        await Message.create(botMessage);
      }
    });
  });
};
