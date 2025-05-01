import Game from "../models/Game.js";
import {
  OPPONENT_TEAMS,
  FURIA_PLAYERS,
  OPPONENT_PLAYERS,
} from "../enums/teams.js";
import { io } from "../socket/socketInstance.js";

function getRandomOpponent() {
  const index = Math.floor(Math.random() * OPPONENT_TEAMS.length);
  return OPPONENT_TEAMS[index];
}

function getRandomEvent(killer, victim) {
  const actions = [
    "eliminou",
    "headshotou",
    "aniquilou",
    "explodiu com HE",
    "deu um no-scope em",
  ];
  const action = actions[Math.floor(Math.random() * actions.length)];
  return `${killer} ${action} ${victim}`;
}

export async function startGameSimulation() {
  const opponent = getRandomOpponent();
  const teams = ["FURIA", opponent];
  const playersFuria = [...FURIA_PLAYERS];
  const playersOpponent = [...OPPONENT_PLAYERS[opponent]];
  const score = { FURIA: 0, [opponent]: 0 };

  const game = new Game({ teams, score, status: "in_progress" });
  await game.save();

  io.emit("message", {
    sender: "BOT FURIA",
    message: `Iniciando partida: FURIA vs ${opponent}`,
    type: "bot",
  });

  const interval = setInterval(async () => {
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

    io.emit("message", {
      sender: "BOT FURIA",
      message: eventDescription,
      type: "event",
    });

    io.emit("message", {
      sender: "BOT FURIA",
      message: `${killerTeam} ganhou 1 ponto! Placar: FURIA ${score.FURIA} x ${score[opponent]} ${opponent}`,
      type: "score",
    });

    io.emit("score-update", score);

    if (score.FURIA >= 16 || score[opponent] >= 16) {
      clearInterval(interval);
      game.status = "ended";
      game.endedAt = new Date();
      await game.save();

      io.emit("message", {
        sender: "BOT FURIA",
        message: `Fim de jogo! FURIA ${score.FURIA} x ${score[opponent]} ${opponent}`,
        type: "end",
      });
    } else {
      await game.save();
    }
  }, 6000);
}
