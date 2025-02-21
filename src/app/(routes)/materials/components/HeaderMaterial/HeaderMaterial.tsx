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

export function HeaderMaterial() {
  const[openModalCreate, setOpenModalCreate] = useState(false)
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">List of materials</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Create material</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
              <DialogTitle>Create Material</DialogTitle>
              <DialogDescription>
                Create and configure your new material
              </DialogDescription>
          </DialogHeader>

          <FormCreateMaterial setOpenModalCreate={setOpenModalCreate} />

        </DialogContent>
      </Dialog>
    </div>
  )
}
