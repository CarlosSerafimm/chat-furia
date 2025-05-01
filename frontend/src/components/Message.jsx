export default function Message({ msg, own }) {
  const isBot = msg.type === "bot";

  const textColor = isBot
    ? "text-purple-400"
    : own
    ? "text-green-400"
    : "text-white";

  return (
    <div
      className={`flex items-start gap-3 mb-3 ${
        own ? "justify-end" : "justify-start"
      }`}
    >
      {!own && (
        <div className="w-8 h-8 rounded-full bg-zinc-500 flex-shrink-0" />
      )}
      <div
        className={`flex flex-col ${textColor} max-w-[80%] break-words bg-zinc-700 p-2 rounded-lg`}
      >
        <span className="font-semibold">{msg.sender}</span>
        <span className="text-sm">{msg.message}</span>
      </div>
      {own && (
        <div className="w-8 h-8 rounded-full bg-zinc-500 flex-shrink-0" />
      )}
    </div>
  );
}
