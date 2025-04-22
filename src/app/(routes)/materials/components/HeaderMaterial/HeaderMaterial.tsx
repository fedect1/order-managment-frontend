"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
 
import { Button } from "@/components/ui/button"
 
import { useState } from "react"
import { FormCreateMaterial } from "../FormCreateMaterial"
import { RawTypeData } from '../FormCreateMaterial/FormCreateMaterial.interface';

interface HeaderMaterialProps {
  rawTypes: RawTypeData[]
}

export function HeaderMaterial({ rawTypes }: HeaderMaterialProps) {
  const [openModalCreate, setOpenModalCreate] = useState(false)
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">Lista materiałów</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Utwórz materiał</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Utwórz materiał</DialogTitle>
            <DialogDescription>
            Utwórz i skonfiguruj nowy materiał
            </DialogDescription>
          </DialogHeader>
          
          <FormCreateMaterial 
            setOpenModalCreate={setOpenModalCreate} 
            rawTypes={rawTypes}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}