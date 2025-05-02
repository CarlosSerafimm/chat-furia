import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { socket } from "@/socket.js";
import { CheckCircle, Clock, XCircle } from "lucide-react"; 
import { motion } from "framer-motion"; 

const EventMessage = ({ description, timestamp }) => (
  <motion.div
    className="flex items-center gap-2 p-3 hover:bg-zinc-800 rounded-md cursor-pointer"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-xs text-zinc-400">
      {new Date(timestamp).toLocaleTimeString()}
    </span>
    <span className="text-white">{description}</span>
  </motion.div>
);

export function AppSidebar() {
  const [gameDetails, setGameDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.on("game-update", (data) => {
      setGameDetails(data);
      setEvents(data.events || []);
      setScore(data.score);
      setStatus(data.status);
    });

    return () => {
      socket.off("game-update");
    };
  }, []);

  return (
    <Sidebar className="bg-zinc-900 text-zinc-200 border-r border-zinc-700 shadow-md h-screen">
      <SidebarHeader className="px-4 py-3 border-b border-zinc-700 text-lg font-bold flex justify-between items-center bg-zinc-900 text-zinc-200">
        {gameDetails ? (
          <>
            <span className="flex items-center gap-2">
              <Clock size={20} />
              {gameDetails.teams[0]} vs {gameDetails.teams[1]}
            </span>
            <span className="text-lg">
              {score &&
                `${score[gameDetails.teams[0]]} - ${
                  score[gameDetails.teams[1]]
                }`}
            </span>
          </>
        ) : (
          <span className="flex items-center gap-2">
            Nenhuma partida em andamento
          </span>
        )}
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-2 px-4 py-4 overflow-y-auto bg-zinc-900">
        <SidebarGroup className="text-xs text-zinc-500">Eventos</SidebarGroup>
        {events.length === 0 ? (
          <motion.div
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Nenhum evento registrado.
          </motion.div>
        ) : (
          events.map((event, index) => (
            <EventMessage
              key={index}
              description={event.description}
              timestamp={event.timestamp}
            />
          ))
        )}
      </SidebarContent>

      <SidebarFooter className="px-4 py-3 border-t border-zinc-700 text-sm text-zinc-400 bg-zinc-900">
        Status:{" "}
        <span
          className={
            status === "finalizado"
              ? "text-red-400"
              : status === "pausado"
              ? "text-yellow-300"
              : status
              ? "text-green-400"
              : "text-zinc-400"
          }
        >
          {status === "finalizado" ? (
            <>
              <CheckCircle size={16} className="inline-block mr-1" />
              Partida finalizada
            </>
          ) : status === "pausado" ? (
            <>
              <span className="inline-block mr-1">⏸️</span>
              Jogo pausado
            </>
          ) : status ? (
            <>
              <span className="inline-block mr-1">🎮</span>
              {status}
            </>
          ) : (
            <>
              <span className="inline-block mr-1">🕹️</span>
              Sem partida ativa
            </>
          )}
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
