import User from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async ({ username, password }) => {
  if (!username || !password)
    throw new Error("Username e senha são obrigatórios");

  const nomeProibido = "BOT FURIA";
  if (username.trim().toUpperCase() === nomeProibido)
    throw new Error("Este nome de usuário não é permitido");

  
  const existing = await User.findOne({ username });
  if (existing) throw new Error("Usuário já existe");

  const user = new User({ username, password });
  return await user.save();
};

export const loginUser = async ({ username, password }) => {
  if (!username || !password)
    throw new Error("Username e senha são obrigatórios");

  const user = await User.findOne({ username });
  if (!user) throw new Error("Usuário não encontrado");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Senha incorreta");

  return user;
};
