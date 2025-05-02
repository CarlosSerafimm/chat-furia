import Game from "../models/Game.js";
import {
  startGameSimulation,
  pauseGame,
  endGame,
  resumeGame,
} from "../service/GameService.js";

export async function iniciarSimulacao(req, res) {
  try {
    const existingGame = await Game.findOne({
      status: { $in: ["em_andamento", "pausado"] },
    });

    if (existingGame) {
      return res.status(400).json({
        error: `Já existe uma simulação com status '${existingGame.status}'.`,
      });
    }

    startGameSimulation();
    res.status(200).json({ message: "Simulação iniciada com sucesso." });
  } catch (err) {
    console.error("Erro ao iniciar simulação:", err);
    res.status(500).json({ error: "Erro ao iniciar simulação." });
  }
}

export async function pausarSimulacao(req, res) {
  try {
    const jogo = await Game.findOne({ status: "em_andamento" });

    if (!jogo) {
      return res
        .status(400)
        .json({ error: "❌ Nenhuma partida em andamento no momento." });
    }

    await pauseGame();
    res.status(200).json({ message: "⏸️ Pausando a simulação..." });
  } catch (err) {
    console.error("Erro ao pausar simulação:", err);
    res.status(500).json({ error: "Erro ao pausar simulação." });
  }
}

export async function finalizarSimulacao(req, res) {
  try {
    const jogo = await Game.findOne({
      status: { $in: ["em_andamento", "pausado"] },
    });

    if (!jogo) {
      return res
        .status(400)
        .json({ error: "❌ Nenhuma partida em andamento no momento." });
    }

    await endGame();
    res.status(200).json({ message: "🏁 Finalizando a partida atual." });
  } catch (err) {
    console.error("Erro ao finalizar simulação:", err);
    res.status(500).json({ error: "Erro ao finalizar simulação." });
  }
}

export async function retomarSimulacao(req, res) {
  try {
    const jogo = await Game.findOne({ status: "pausado" });

    if (!jogo) {
      return res
        .status(400)
        .json({ error: "❌ Nenhuma partida pausada no momento." });
    }

    await resumeGame();
    res.status(200).json({ message: "▶️ Retomando a partida atual." });
  } catch (err) {
    console.error("Erro ao retomar simulação:", err);
    res.status(500).json({ error: "Erro ao retomar simulação." });
  }
}
