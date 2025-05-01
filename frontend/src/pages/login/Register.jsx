import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Register({ toggle }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) return;
    try {
      const res = await axios.post("http://localhost:3000/register", {
        username,
        password,
      });
      alert(res.data.message);
      toggle();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao registrar");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-800 rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center"
    >
      <div className="w-20 h-20 rounded-full bg-zinc-600 mb-6" />
      <h1 className="text-2xl font-bold mb-4 text-center">Registrar</h1>
      <Input
        className="mb-3"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        className="mb-4"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={handleRegister}
      >
        Registrar
      </Button>
      <p className="mt-4 text-sm text-center">
        Já tem conta?{" "}
        <button
          onClick={toggle}
          className="text-sm text-blue-600 hover:text-blue-800 underline transition"
        >
          Login
        </button>
      </p>
    </motion.div>
  );
}
