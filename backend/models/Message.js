import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "bot", "command", "event", "score", "end", "sticker"],
    default: "text"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
