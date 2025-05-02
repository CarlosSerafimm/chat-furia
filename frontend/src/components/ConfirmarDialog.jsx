import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CirclePlus } from "lucide-react";

export default function ConfirmarDialog({
  iniciarSimulacao,
  pausarSimulacao,
  retomarSimulacao,
  finalizarSimulacao,
}) {
  const [open, setOpen] = useState(false);

  const closeAndRun = (callback) => {
    callback();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-purple-600 hover:bg-purple-900 hover:text-white text-white p-2 rounded-full shadow-lg cursor-pointer "
        >
          <CirclePlus className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 text-white border border-zinc-700 rounded-xl shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-purple-400">
            Controle da Simulação
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Selecione uma das ações abaixo para controlar a partida em
            andamento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={() => closeAndRun(iniciarSimulacao)}
            className="cursor-pointer border border-purple-400 bg-purple-600 hover:bg-purple-900 text-white px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="text-xl">▶️</span> Iniciar
          </Button>

          <Button
            onClick={() => closeAndRun(pausarSimulacao)}
            className="cursor-pointer border border-yellow-400 text-white bg-yellow-600 hover:bg-yellow-900 hover:text-yellow-100 px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            variant="outline"
          >
            <span className="text-xl">⏸️</span> Pausar
          </Button>

          <Button
            onClick={() => closeAndRun(retomarSimulacao)}
            className="cursor-pointer border border-emerald-400 text-white bg-emerald-600 hover:bg-emerald-900 hover:text-emerald-100 px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            variant="outline"
          >
            <span className="text-xl">🔄</span> Retomar
          </Button>

          <Button
            onClick={() => closeAndRun(finalizarSimulacao)}
            className="cursor-pointer border border-red-400 text-white bg-red-600 hover:bg-red-900 hover:text-red-100 px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
            variant="outline"
          >
            <span className="text-xl">🏁</span> Finalizar
          </Button>
        </div>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="cursor-pointer text-zinc-400  transition-all px-4 py-2"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
