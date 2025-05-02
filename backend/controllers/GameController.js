import Game from "../models/Game.js";
import { startGameSimulation } from "../service/GameService.js";

export async function iniciarSimulacao(req, res) {
  try {
    const existingGame = await Game.findOne({ status: "em_andamento" });

    if (existingGame) {
      return res
        .status(400)
        .json({ error: "Já existe uma simulação em andamento." });
    }
    startGameSimulation();
    res.status(200).json({ message: "Simulação iniciada com sucesso." });
  } catch (err) {
    console.error("Erro ao iniciar simulação:", err);
    res.status(500).json({ error: "Erro ao iniciar simulação." });
  }
}
