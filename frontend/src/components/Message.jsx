export default function Message({ msg }) {
    const isBot = msg.type === "bot";
    const textColor = isBot ? "text-purple-400" : "text-white";
  
    return (
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-zinc-500 flex-shrink-0" />
        <div className={`flex flex-col ${textColor}`}>
          <span className="font-semibold">{msg.sender}</span>
          <span className="text-sm">{msg.message}</span>
        </div>
      </div>
    );
  }
  