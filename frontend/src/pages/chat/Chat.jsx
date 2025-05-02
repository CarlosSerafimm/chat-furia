import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket.js";
import ChatBox from "@/components/ChatBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmarDialog from "@/components/ConfirmarDialog";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const inputRef = useRef(null);
  const [chatBoxHeight, setChatBoxHeight] = useState("auto");
  const [erroSimulacao, setErroSimulacao] = useState(null);

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
      // socket.disconnect();

      sessionStorage.removeItem("loggedInManually");
      // sessionStorage.removeItem("password");
      // sessionStorage.removeItem("username");
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

  const deslogar = () => {
    socket.disconnect();

    sessionStorage.removeItem("loggedInManually");
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const calculateChatBoxHeight = () => {
      requestAnimationFrame(() => {
        const headerHeight = headerRef.current?.offsetHeight || 0;
        const inputHeight = inputRef.current?.offsetHeight || 0;
        const availableHeight =
          window.innerHeight - headerHeight - inputHeight - 32;
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

  useEffect(() => {
    if (erroSimulacao) {
      const timeout = setTimeout(() => {
        setErroSimulacao(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [erroSimulacao]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chatMessage", input);
    setInput("");
  };

  const iniciarSimulacao = async () => {
    try {
      await axios.post("http://localhost:3000/iniciar-simulacao");
      setErroSimulacao(null);
    } catch (error) {
      console.error("Erro ao iniciar simulação:", error);
      const msg = error.response?.data?.error || "Erro ao iniciar simulação.";
      setErroSimulacao(msg);
    }
  };
  const pausarSimulacao = async () => {
    try {
      await axios.post("http://localhost:3000/pausar-simulacao");
      setErroSimulacao(null);
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao pausar simulação.";
      setErroSimulacao(msg);
    }
  };

  const finalizarSimulacao = async () => {
    try {
      await axios.post("http://localhost:3000/finalizar-simulacao");
      setErroSimulacao(null);
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao finalizar simulação.";
      setErroSimulacao(msg);
    }
  };

  const retomarSimulacao = async () => {
    try {
      await axios.post("http://localhost:3000/retomar-simulacao");
      setErroSimulacao(null);
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao retomar simulação.";
      setErroSimulacao(msg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col">
      <header
        ref={headerRef}
        className="relative py-4 text-2xl font-bold border-b border-zinc-800 text-center"
      >
        Chat da FURIA
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 border border-red-400 bg-red-600 hover:bg-red-800"
            >
              Deslogar
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-zinc-800 text-white border border-zinc-700 shadow-2xl rounded-2xl max-w-md mx-auto px-6 py-5 animate-in fade-in slide-in-from-top duration-300">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-white">
                Deseja realmente sair?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-zinc-400 mt-1">
                Isso encerrará sua sessão no chat e você será redirecionado para
                a tela de login.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="bg-zinc-700 text-white hover:bg-zinc-600 transition-colors">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deslogar}
                className="bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                Sair do chat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="overflow-hidden flex flex-col px-4 pt-4">
        <div
          className="overflow-y-auto"
          style={{ height: `${chatBoxHeight}px` }}
        >
          <ChatBox
            messages={messages}
            endRef={messagesEndRef}
            username={storedUsername}
          />
        </div>

        <div className="flex gap-2 mt-4 pb-3" ref={inputRef}>
          <AnimatePresence>
            {erroSimulacao && (
              <motion.p
                key="erro"
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {erroSimulacao}
              </motion.p>
            )}
          </AnimatePresence>
          <ConfirmarDialog
            iniciarSimulacao={iniciarSimulacao}
            pausarSimulacao={pausarSimulacao}
            retomarSimulacao={retomarSimulacao}
            finalizarSimulacao={finalizarSimulacao}
          />
          <Input
            className="bg-zinc-800 text-white flex-1"
            placeholder="Digite uma mensagem ou comando"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button className="cursor-pointer border border-emerald-400 bg-emerald-800 hover:bg-emerald-950" onClick={sendMessage}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
