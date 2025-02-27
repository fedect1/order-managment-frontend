"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Material {
  RAWMAT_RAWMAT: number;
  RAWMAT_NAME: string;
  RAWMAT_COLOR: number;
  RAWMAT_DENSITY: number;
}

interface ChargeSelectorProps {
  materials: Material[];
  onSelect: (rawmat: number) => void;
}

export function ChargeSelector({ materials, onSelect }: ChargeSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (rawmat: number) => {
    onSelect(rawmat);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Seleccionar Material</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecciona un Material</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2 mt-4">
          {materials.map((material) => (
            <Button
              key={material.RAWMAT_RAWMAT}
              variant="ghost"
              onClick={() => handleSelect(material.RAWMAT_RAWMAT)}
            >
              {material.RAWMAT_NAME}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
