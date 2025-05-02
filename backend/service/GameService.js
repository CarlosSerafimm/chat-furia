import Game from "../models/Game.js";

import {
  OPPONENT_TEAMS,
  FURIA_PLAYERS,
  OPPONENT_PLAYERS,
} from "../utils/teams.js";
import { io } from "../socket/socketInstance.js";
import Message from "../models/Message.js";

let currentInterval = null;

async function emitAndSaveMessage(data) {
  io.emit("message", data);
  await Message.create(data);
}

function getRandomOpponent() {
  const index = Math.floor(Math.random() * OPPONENT_TEAMS.length);
  return OPPONENT_TEAMS[index];
}

function getRandomEvent(killer, victim) {
  const actions = [
    { action: "eliminou", emoji: "💥" },
    { action: "headshotou", emoji: "🎯" },
    { action: "aniquilou", emoji: "🔥" },
    { action: "explodiu com HE", emoji: "💣" },
    { action: "deu um no-scope em", emoji: "👀" },
  ];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  const action = randomAction.action;
  const emoji = randomAction.emoji;
  return `${killer} ${action} ${victim} ${emoji}`;
}

export async function startGameSimulation() {
  const opponent = getRandomOpponent();
  const teams = ["FURIA", opponent];
  const playersFuria = [...FURIA_PLAYERS];
  const playersOpponent = [...OPPONENT_PLAYERS[opponent]];
  const score = { FURIA: 0, [opponent]: 0 };

  const game = new Game({ teams, score, status: "em_andamento" });
  await game.save();

  await emitAndSaveMessage({
    sender: "BOT FURIA",
    message: `Iniciando partida: FURIA vs ${opponent}`,
    type: "bot",
    timestamp: new Date().toISOString(),
  });

  io.emit("game-update", {
    teams,
    score,
    status: "em_andamento",
  });

  currentInterval = setInterval(async () => {
    const killerTeam = Math.random() > 0.5 ? "FURIA" : opponent;
    const victimTeam = killerTeam === "FURIA" ? opponent : "FURIA";

    const killer =
      killerTeam === "FURIA"
        ? playersFuria[Math.floor(Math.random() * playersFuria.length)]
        : playersOpponent[Math.floor(Math.random() * playersOpponent.length)];

    const victim =
      victimTeam === "FURIA"
        ? playersFuria[Math.floor(Math.random() * playersFuria.length)]
        : playersOpponent[Math.floor(Math.random() * playersOpponent.length)];

    const eventDescription = getRandomEvent(killer, victim);

    game.events.push({ description: eventDescription });
    score[killerTeam]++;
    game.score = score;

    await emitAndSaveMessage({
      sender: "BOT FURIA",
      message: eventDescription,
      type: "event",
      timestamp: new Date().toISOString(),
    });
    await emitAndSaveMessage({
      sender: "BOT FURIA",
      message: `${killerTeam} ganhou 1 ponto! Placar: FURIA ${score.FURIA} x ${score[opponent]} ${opponent}`,
      type: "score",
      timestamp: new Date().toISOString(),
    });

    io.emit("score-update", score);

    io.emit("game-update", {
      teams,
      score,
      status: game.status,
      events: game.events,
    });

    if (score.FURIA >= 16 || score[opponent] >= 16) {
      clearInterval(interval);
      currentInterval = null;
      game.status = "finalizado";
      game.endedAt = new Date();
      await game.save();

      await emitAndSaveMessage({
        sender: "BOT FURIA",
        message: `Fim de jogo! FURIA ${score.FURIA} x ${score[opponent]} ${opponent}`,
        type: "end",
        timestamp: new Date().toISOString(),
      });

      io.emit("game-update", {
        teams,
        score,
        status: "finalizado",
        events: game.events,
      });
    } else {
      await game.save();
    }
  }, 6000);
}

export async function pauseGame() {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;

    const game = await Game.findOne({ status: "em_andamento" });
    if (game) {
      game.status = "pausado";
      await game.save();
    }

    await emitAndSaveMessage({
      sender: "BOT FURIA",
      message: "⏸️ Partida pausada.",
      type: "bot",
      timestamp: new Date().toISOString(),
    });
    io.emit("game-update", {
      teams: game.teams,
      score: game.score,
      status: "pausado",
      events: game.events,
    });
  }
}

export async function endGame() {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = null;
  }

  const game = await Game.findOne({
    status: { $in: ["em_andamento", "pausado"] },
  });
  console.log(game);

  if (game && game.status !== "finalizado") {
    game.status = "finalizado";
    game.endedAt = new Date();
    await game.save();

    const scoreObject =
      game.score instanceof Map ? Object.fromEntries(game.score) : game.score;

    const opponent = game.teams[1];
    await emitAndSaveMessage({
      sender: "BOT FURIA",
      message: `🚨 Partida finalizada manualmente. Placar final: FURIA ${scoreObject.FURIA} x ${scoreObject[opponent]} ${opponent}`,
      type: "end",
      timestamp: new Date().toISOString(),
    });

    io.emit("game-update", {
      teams: game.teams,
      score: game.score,
      status: "finalizado",
      events: game.events,
    });
  }
}

export async function resumeGame() {
  if (currentInterval) return;

  const game = await Game.findOne({
    status: { $in: ["em_andamento", "pausado"] },
  });

  if (!game) return;

  const [teamA, teamB] = game.teams;
  const playersFuria = [...FURIA_PLAYERS];
  const playersOpponent = [...OPPONENT_PLAYERS[teamB]];
  const score = game.score;

  if (game.status === "pausado") {
    game.status = "em_andamento";
    await emitAndSaveMessage({
      sender: "BOT FURIA",
      message: "▶️ Partida retomada!",
      type: "bot",
      timestamp: new Date().toISOString(),
    });
  }

  await game.save();
  const scoreObject = Object.fromEntries(score);

  io.emit("game-update", {
    teams: game.teams,
    score: scoreObject,
    status: "em_andamento",
    events: game.events,
  });

  currentInterval = setInterval(async () => {
    const killerTeam = Math.random() > 0.5 ? "FURIA" : teamB;
    const victimTeam = killerTeam === "FURIA" ? teamB : "FURIA";

    const killer =
      killerTeam === "FURIA"
        ? playersFuria[Math.floor(Math.random() * playersFuria.length)]
        : playersOpponent[Math.floor(Math.random() * playersOpponent.length)];

    const victim =
      victimTeam === "FURIA"
        ? playersFuria[Math.floor(Math.random() * playersFuria.length)]
        : playersOpponent[Math.floor(Math.random() * playersOpponent.length)];

    const eventDescription = getRandomEvent(killer, victim);

    game.events.push({ description: eventDescription });
    const currentScore = score.get(killerTeam) || 0;
    score.set(killerTeam, currentScore + 1);
    game.score = score;
    const updatedScore = Object.fromEntries(score);

    await emitAndSaveMessage({
      sender: "BOT FURIA",
      message: eventDescription,
      type: "event",
      timestamp: new Date().toISOString(),
    });

    await emitAndSaveMessage({
      sender: "BOT FURIA",
      message: `${killerTeam} ganhou 1 ponto! Placar: FURIA ${updatedScore.FURIA} x ${updatedScore[teamB]} ${teamB}`,
      type: "score",
      timestamp: new Date().toISOString(),
    });

    io.emit("score-update", updatedScore);

    io.emit("game-update", {
      teams: game.teams,
      score: updatedScore,
      status: game.status,
      events: game.events,
    });

    if (updatedScore.FURIA >= 16 || updatedScore[teamB] >= 16) {
      clearInterval(currentInterval);
      currentInterval = null;

      game.status = "finalizado";
      game.endedAt = new Date();
      await game.save();

      await emitAndSaveMessage({
        sender: "BOT FURIA",
        message: `🏁 Fim de jogo! FURIA ${score.FURIA} x ${score[teamB]} ${teamB}`,
        type: "end",
        timestamp: new Date().toISOString(),
      });

      io.emit("game-update", {
        teams: game.teams,
        score: updatedScore,
        status: "finalizado",
        events: game.events,
      });
    } else {
      await game.save();
    }
  }, 6000);
}
