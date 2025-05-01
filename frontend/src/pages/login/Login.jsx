import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim()) return;

    socket.emit("register", username, (response) => {
      if (response.success) {
        navigate("/chat", { state: { username } });
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-800 rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-zinc-600 mb-6" />

        <h1 className="text-2xl font-bold mb-4 text-center">
          Entrar no Chat da FURIA
        </h1>

        <Input
          className="mb-4"
          placeholder="Digite seu nome único"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </motion.div>
    </div>
  );
}
