import { FURIA_PLAYERS } from "./teams.js";

export const chatCommands = {
    "/hino": {
      response: "🎵 VAMOS FURIAAAA!",
    },
    "/ajuda": {
      response: "Comandos disponíveis: /hino, /jogadores, /sobre, /ajuda",
    },
    "/help": {
      response: "Comandos disponíveis: /hino, /jogadores, /sobre, /ajuda",
    },
    "/sobre": {
      response: "A FURIA é um dos maiores times de CS:GO do Brasil! 🐍",
    },
    "/jogadores": {
      response: `Os jogadores da FURIA incluem: ${FURIA_PLAYERS.join(", ")}`,
    },
  };