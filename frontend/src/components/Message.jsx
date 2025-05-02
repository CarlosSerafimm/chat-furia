import { User } from "lucide-react";
import furiaLogo from "@/assets/furia-logo.png";

export default function Message({ msg, own }) {

  console.log(msg);
  
  const timestamp = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  let textColor = "";
  let bgColor = "";

  switch (msg.type) {
    case "bot":
      textColor = "text-purple-400";
      bgColor = "bg-purple-900/40";
      break;
    case "event":
      textColor = "text-orange-400";
      bgColor = "bg-orange-900/40";
      break;
    case "score":
      textColor = "text-blue-400";
      bgColor = "bg-blue-900/30";
      break;
    case "end":
      textColor = "text-red-400";
      bgColor = "bg-red-900/40";
      break;
    default:
      textColor = own ? "text-green-400" : "text-white";
      bgColor = own ? "bg-green-900/30" : "bg-zinc-700";
  }

  return (
    <div
      className={`flex items-start gap-3 mb-3 ${
        own ? "justify-end" : "justify-start"
      }`}
    >
      {!own &&
        (["bot", "event", "score", "end", "sticker"].includes(msg.type) ? (
          <img
            src={furiaLogo}
            alt="Logo FURIA"
            className="w-10 h-10 flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-500 flex-shrink-0 flex items-center justify-center">
            <User />
          </div>
        ))}

      <div
        className={`flex flex-col ${textColor} ${bgColor} max-w-[80%] break-words py-1 px-4 rounded-lg`}
      >
        <span className="font-semibold">{msg.sender}</span>

        {msg.type === "sticker" ? (
          <div className="">
            <img
              src={furiaLogo}
              alt="Sticker"
              className="w-32 h-32 mt-2 rounded-lg"
            />
          </div>
        ) : (
          <span className="text-sm whitespace-pre-line">{msg.message}</span>
        )}

        <span className="text-zinc-400 text-xs mt-1 self-end">{timestamp}</span>
      </div>

      {own && (
        <div className="w-8 h-8 rounded-full bg-zinc-500 flex-shrink-0 flex items-center justify-center">
          <User />
        </div>
      )}
    </div>
  );
}
