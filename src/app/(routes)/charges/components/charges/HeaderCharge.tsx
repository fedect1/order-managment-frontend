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

export function HeaderCharge() {
  const[openModalCreate, setOpenModalCreate] = useState(false)
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">List of Charges</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Create charge</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
              <DialogTitle>Create Charge</DialogTitle>
              <DialogDescription>
                Create and configure your new Charge
              </DialogDescription>
          </DialogHeader>

          {/* <FormCreateMaterial setOpenModalCreate={setOpenModalCreate} /> */}

        </DialogContent>
      </Dialog>
    </div>
  )
}
