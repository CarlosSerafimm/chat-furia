import Message from "../models/Message.js";

const usuarios = new Map();
const activeUsers = new Set();

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado");

    socket.on("register", (username, callback) => {
      if (usuarios.has(username)) {
        return callback?.({ success: false, message: "Nome já em uso" });
      }

      usuarios.set(username, socket.id);
      socket.username = username;
      console.log(`Usuário registrado: ${username}`);

      callback?.({ success: true });

      io.emit("message", {
        sender: "BOT",
        message: `${username} entrou no chat`,
        type: "bot",
        timestamp: new Date(),
      });
    });

    socket.on("chatMessage", async (msg) => {
      try {
        const message = new Message({
          sender: socket.username,
          message: msg,
          type: msg.startsWith("/") ? "command" : "text",
        });
        await message.save();
        io.emit("message", message);
      } catch (err) {
        console.error("Erro ao salvar mensagem:", err);
      }
    });

    socket.on("disconnect", () => {
      if (socket.username) {
        activeUsers.delete(socket.username);
        io.emit("message", {
          sender: "BOT",
          message: `${socket.username} saiu do chat`,
          type: "bot",
          timestamp: new Date(),
        });
      }
    });
  });
};
