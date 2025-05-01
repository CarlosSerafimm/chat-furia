import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "@/socket.js";
import ChatBox from "@/components/ChatBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const storedUsername = sessionStorage.getItem("username");
  const storedPassword = sessionStorage.getItem("password");
  const alreadyLoggedInRef = useRef(false);

  useEffect(() => {
    if (!storedUsername || !storedPassword) {
      navigate("/", { replace: true });
      return;
    }

    const manualLogin = sessionStorage.getItem("loggedInManually") === "true";

    if (manualLogin && !socket.connected) {
      sessionStorage.removeItem("loggedInManually");
    }

    const handleConnect = () => {
      if (!socket.hasLoggedIn) {
        socket.emit("login", {
          username: storedUsername,
          password: storedPassword,
        });
        socket.hasLoggedIn = true; // Marcar como logado
      }
    };

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleDisconnect = () => {
      socket.hasLoggedIn = false;
      sessionStorage.removeItem("loggedInManually");
      navigate("/", { replace: true });
    };

    socket.on("connect", handleConnect);
    socket.on("message", handleMessage);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("message", handleMessage);
      socket.off("disconnect", handleDisconnect);
    };
  }, [navigate, storedUsername, storedPassword]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chatMessage", input);
    setInput("");
  };

  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col">
      <header className="text-center py-4 text-2xl font-bold border-b border-zinc-800">
        Chat da FURIA
      </header>

      <div className="flex-1 overflow-hidden flex flex-col px-4 pt-4">
        <ChatBox messages={messages} endRef={messagesEndRef} />
        <div className="flex gap-2 mt-4 mb-6">
          <Input
            className="bg-zinc-800 text-white flex-1"
            placeholder="Digite uma mensagem ou comando"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Enviar</Button>
        </div>
      </div>
    </div>
  );
}
