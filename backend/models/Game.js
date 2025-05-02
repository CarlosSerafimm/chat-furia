import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  teams: {
    type: [String],
    required: true,
    validate: (arr) => arr.length === 2,
  },
  score: {
    type: Map,
    of: Number,
    required: true,
  },
  events: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      description: String,
    },
  ],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: Date,
  status: {
    type: String,
    enum: ["aguardando", "em_andamento", "finalizado", "pausado"],
    default: "waiting",
  },
});

const Game = mongoose.model("Game", gameSchema);
export default Game;
