import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket.js";
import ChatBox from "@/components/ChatBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const inputRef = useRef(null);
  const [chatBoxHeight, setChatBoxHeight] = useState("auto");

  const storedUsername = sessionStorage.getItem("username");
  const storedPassword = sessionStorage.getItem("password");

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
        socket.hasLoggedIn = true;
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
    const calculateChatBoxHeight = () => {
      requestAnimationFrame(() => {
        const headerHeight = headerRef.current?.offsetHeight || 0;
        const inputHeight = inputRef.current?.offsetHeight || 0;
        const availableHeight = window.innerHeight - headerHeight - inputHeight - 32; // 32 = padding/margin do container interno
        setChatBoxHeight(availableHeight);
      });
    };

    window.addEventListener("resize", calculateChatBoxHeight);
    calculateChatBoxHeight();

    return () => window.removeEventListener("resize", calculateChatBoxHeight);
  }, []);

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
      <header
        ref={headerRef}
        className="text-center py-4 text-2xl font-bold border-b border-zinc-800"
      >
        Chat da FURIA
      </header>

      <div className="overflow-hidden flex flex-col px-4 pt-4">
        <div
          className="overflow-y-auto"
          style={{ height: `${chatBoxHeight}px` }}
        >
          <ChatBox messages={messages} endRef={messagesEndRef} username={storedUsername}/>
        </div>

        <div className="flex gap-2 mt-4 pb-3" ref={inputRef}>
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
