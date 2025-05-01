import { motion } from "framer-motion";
import Message from "./Message";

export default function ChatBox({ messages, endRef, username }) {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-800 rounded-lg p-4 space-y-2">
      {messages.map((msg, i) => {
        const isOwnMessage = msg.sender === username;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <Message msg={msg} own={isOwnMessage} />
          </motion.div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
