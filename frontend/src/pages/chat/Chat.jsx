import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "@/socket.js";
import ChatBox from "@/components/ChatBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state?.username) {
      navigate("/", { replace: true }); // 👈 sem username, volta para login
      return;
    }

    setUsername(state.username);
    socket.emit("register", state.username);

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [state, navigate]);


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
