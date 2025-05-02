import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import furiaLogo from "@/assets/furia-logo.png";
import { LogIn } from "lucide-react";

export default function Login({ toggle }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (!socket.connected) {
    socket.connect();
  }

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) return;

    socket.emit("login", { username, password }, (response) => {
      if (response.success) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("loggedInManually", "true");
        navigate("/chat", { state: { fromLogin: true } });
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-800 rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center"
    >
      <div className="flex items-center gap-2 bg-blue-800/40 text-blue-300 text-xs px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
        <LogIn className="w-4 h-4" />
        <span>Login</span>
      </div>

      <div className="w-20 h-20 rounded-full mb-6">
        <img src={furiaLogo} alt="furia-logo" />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">
        Entre na Arena da FURIA!
      </h1>

      <Input
        className="mb-4"
        placeholder="Digite seu nome único"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Input
        className="mb-4"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        onClick={handleLogin}
      >
        Login
      </Button>
      <p className="mt-4 text-sm text-center">
        Quer fazer parte do time?{" "}
        <button
          onClick={toggle}
          className="text-sm text-blue-600 hover:text-blue-800 underline transition cursor-pointer"
        >
          Registre
        </button>
      </p>
    </motion.div>
  );
}
