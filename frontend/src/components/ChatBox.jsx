import { motion } from "framer-motion";
import Message from "./Message";

export default function ChatBox({ messages, endRef }) {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-800 rounded-lg p-4">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Message msg={msg} />
        </motion.div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
