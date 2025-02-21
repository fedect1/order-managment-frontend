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
import { FormCreateType } from "../FormCreateType/FormCreateTyte"

export function HeaderType() {
  const[openModalCreate, setOpenModalCreate] = useState(false)
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">Types</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>New Type</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
              <DialogTitle>Create Type</DialogTitle>
              <DialogDescription>
                Create and configure your new Type
              </DialogDescription>
          </DialogHeader>

          <FormCreateType setOpenModalCreate={setOpenModalCreate} />

        </DialogContent>
      </Dialog>
    </div>
  )
}
