import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ConfirmarDialog({ onConfirm }) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-purple-700 hover:bg-purple-600">
          Simular Partida
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 text-white border-zinc-700">
        <h2 className="text-lg font-semibold mb-2">Confirmar simulação</h2>
        <p className="text-sm mb-4 text-zinc-300">
          Deseja realmente iniciar a simulação da partida?
        </p>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="text-zinc-300 hover:text-white"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-purple-700 hover:bg-purple-600"
          >
            Iniciar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
