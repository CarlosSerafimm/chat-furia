import { registerUser, loginUser } from "../service/UserService.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username e senha são obrigatórios" });
    }

    const user = await registerUser({ username, password });
    res.status(201).json({ message: "Usuário registrado com sucesso", user });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(400).json({ error: err.message || "Erro desconhecido ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username e senha são obrigatórios" });
    }

    const user = await loginUser({ username, password });
    res.status(200).json({ message: "Login bem-sucedido", user });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(400).json({ error: err.message || "Erro desconhecido ao fazer login" });
  }
};
