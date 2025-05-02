import Game from "../models/Game.js";
import { endGame, pauseGame } from "../service/GameService.js";
import { coachMessages } from "./coachMessages.js";
import { dicasFuria } from "./dicas.js";
import { hinosFuria } from "./hinosFuria.js";
import { FURIA_PLAYERS } from "./teams.js";
import { titulos } from "./titulos.js";
import { torcidaMessages } from "./torcidaMessages.js";

const urlLogo = "../assets/furia-logo.png";

export const chatCommands = {
  "/ajuda": {
    response:
      "Comandos disponíveis:\n" +
      "/hino - Toca um hino aleatório da FURIA.\n" +
      "/jogadores - Exibe a lista de jogadores da FURIA.\n" +
      "/sobre - Mostra informações sobre a organização FURIA.\n" +
      "/ajuda - Exibe todos os comandos disponíveis.\n" +
      "/help - Exibe todos os comandos disponíveis.\n" +
      "/dica - Dá uma dica aleatória sobre CS.\n" +
      "/roleta - Dá um palpite de qual jogador vai decidir o round.\n" +
      "/coach - Mensagem do coach SIDDE.\n" +
      "/torcida - Grito da torcida da FURIA.\n" +
      "/sticker - Envia um sticker com o logo da FURIA.\n" +
      "/historia - Exibe a história da FURIA.\n" +
      "/titulos - Lista os principais títulos da FURIA.\n" +
      "/ranking - Exibe a colocação atual da FURIA no ranking mundial.\n" +
      "/proximo-jogo - Exibe informações sobre o próximo jogo da FURIA.\n" +
      "/jogo-anterior - Exibe informações sobre o jogo anterior da FURIA.\n" +
      "/placar - Exibe o placar do jogo que está em andamento.\n" +
      "/rounds - Exibe quantos rounds faltam no máximo para acabar a partida.\n" +
      "/pause - Pausa o jogo que está em andamento.\n" +
      "/finalizar - Finaliza o jogo que está em andamento.",
  },
  "/help": {
    response:
      "Comandos disponíveis:\n" +
      "/hino - Toca um hino aleatório da FURIA.\n" +
      "/jogadores - Exibe a lista de jogadores da FURIA.\n" +
      "/sobre - Mostra informações sobre a organização FURIA.\n" +
      "/ajuda - Exibe todos os comandos disponíveis.\n" +
      "/help - Exibe todos os comandos disponíveis.\n" +
      "/dica - Dá uma dica aleatória sobre CS.\n" +
      "/roleta - Dá um palpite de qual jogador vai decidir o round.\n" +
      "/coach - Mensagem do coach SIDDE.\n" +
      "/torcida - Grito da torcida da FURIA.\n" +
      "/sticker - Envia um sticker com o logo da FURIA.\n" +
      "/historia - Exibe a história da FURIA.\n" +
      "/titulos - Lista os principais títulos da FURIA.\n" +
      "/ranking - Exibe a colocação atual da FURIA no ranking mundial.\n" +
      "/proximo-jogo - Exibe informações sobre o próximo jogo da FURIA.\n" +
      "/jogo-anterior - Exibe informações sobre o jogo anterior da FURIA.\n" +
      "/placar - Exibe o placar do jogo que está em andamento.\n" +
      "/rounds - Exibe quantos rounds faltam no máximo para acabar a partida.\n" +
      "/pause - Pausa o jogo que está em andamento.\n" +
      "/finalizar - Finaliza o jogo que está em andamento.",
  },
  "/hino": {
    response: () => {
      const randomIndex = Math.floor(Math.random() * hinosFuria.length);
      return hinosFuria[randomIndex];
    },
  },

  "/dica": {
    response: () => {
      const randomIndex = Math.floor(Math.random() * dicasFuria.length);
      return dicasFuria[randomIndex];
    },
  },

  "/roleta": {
    response: () => {
      const sorteado =
        FURIA_PLAYERS[Math.floor(Math.random() * FURIA_PLAYERS.length)];
      return `🎰 Quem vai decidir o round: **${sorteado}**! 💥`;
    },
  },

  "/coach": {
    response: () => {
      const frase =
        coachMessages[Math.floor(Math.random() * coachMessages.length)];
      return `🎧 SIDDE DIZ: ${frase}`;
    },
  },

  "/torcida": {
    response: () => {
      const grito =
        torcidaMessages[Math.floor(Math.random() * torcidaMessages.length)];
      return grito;
    },
  },

  "/sticker": {
    response: () => {
      return {
        message: "/assets/furia-logo.png",
        type: "sticker",
      };
    },
  },

  "/jogo-anterior": {
    response: async () => {
      const jogo = await Game.findOne({ status: "finalizado" }).sort({
        endedAt: -1,
      });

      if (!jogo) {
        return "❌ Nenhuma partida finalizada encontrada. Simule uma partida para ver as estatísticas!";
      }

      const { teams, score, startedAt, endedAt } = jogo;

      const duracaoMs = new Date(endedAt) - new Date(startedAt);
      const minutos = Math.floor(duracaoMs / 60000);
      const segundos = Math.floor((duracaoMs % 60000) / 1000);

      const scoreTime1 = score.get(teams[0]);
      const scoreTime2 = score.get(teams[1]);
      const vencedor = scoreTime1 === 16 ? teams[0] : teams[1];

      return `📊 Estatísticas da última partida:\n\n🏆 Vencedor: ${vencedor}\n🆚 ${teams[0]} ${scoreTime1} x ${scoreTime2} ${teams[1]}\n⏱️ Duração: ${minutos}m ${segundos}s`;
    },
  },
  "/placar": {
    response: async () => {
      const jogo = await Game.findOne({ status: "em_andamento" });

      if (!jogo) {
        return "❌ Nenhuma partida em andamento no momento. Tente novamente mais tarde!";
      }

      const { teams, score } = jogo;
      const scoreTime1 = score.get(teams[0]);
      const scoreTime2 = score.get(teams[1]);

      return `📊 Placar Atual:\n\n🆚 ${teams[0]} ${scoreTime1} x ${scoreTime2} ${teams[1]}`;
    },
  },

  "/rounds": {
    response: async () => {
      const jogo = await Game.findOne({ status: "em_andamento" });

      if (!jogo) {
        return "❌ Nenhuma partida em andamento no momento. Inicie uma simulação para acompanhar os rounds!";
      }

      const { teams, score } = jogo;
      const scoreTime1 = score.get(teams[0]) || 0;
      const scoreTime2 = score.get(teams[1]) || 0;
      const roundsTotal = scoreTime1 + scoreTime2;
      const roundsRestantes = 30 - roundsTotal;

      return `🎯 Rounds Restantes: ${roundsRestantes}\n🔢 Rodadas disputadas: ${roundsTotal}/30\n\n📊 Placar Atual:\n🆚 ${teams[0]} ${scoreTime1} x ${scoreTime2} ${teams[1]}`;
    },
  },
  "/pause": {
    response: async () => {
      const jogo = await Game.findOne({ status: "em_andamento" });

      if (!jogo) {
        return "❌ Nenhuma partida em andamento no momento.";
      }
      await pauseGame();
      return "⏸️ Pausando a simulação...";
    },
  },
  "/finalizar": {
    response: async () => {
      const jogo = await Game.findOne({ status: "em_andamento" });

      if (!jogo) {
        return "❌ Nenhuma partida em andamento no momento.";
      }
      await endGame();
      return "🏁 Finalizando a partida atual.";
    },
  },

  "/sobre": {
    response:
      "A FURIA é uma organização brasileira de eSports conhecida pela garra e agressividade em jogos como CS:GO. Fundada em 2017, representa o Brasil com paixão e desempenho de alto nível. 🐍",
  },
  "/jogadores": {
    response: `Os jogadores da FURIA incluem: ${FURIA_PLAYERS.join(", ")}`,
  },
  "/historia": {
    response:
      "A FURIA foi fundada em 2017 e rapidamente se destacou no cenário brasileiro e mundial de CS:GO, conquistando títulos e revelando grandes jogadores como KSCERATO e yuurih. A equipe se consolidou como uma das mais fortes do Brasil, com presença constante em torneios internacionais.",
  },
  "/titulos": {
    response: () => {
      let responseText = "🎖️ **Principais Títulos da FURIA** 🎖️\n\n";

      titulos.forEach((titulo) => {
        responseText += `🏆 ${titulo.posicao} - ${titulo.campeonato}\n`;
        responseText += `📊 Resultado: ${titulo.resultado} contra ${titulo.adversario}\n`;
        responseText += `💰 Premiação: ${titulo.premiacao}\n\n`;
      });

      return responseText.trim();
    },
  },
  "/ranking": {
    response:
      "📊 A FURIA está atualmente na **17ª colocação** do ranking mundial, de acordo com a HLTV em **01/05/2025**. 🔥",
  },
  "/proximo-jogo": {
    response:
      "📅 O próximo jogo da FURIA pode ser consultado diretamente na HLTV: https://www.hltv.org/team/8297/furia 🔗",
  },
};
