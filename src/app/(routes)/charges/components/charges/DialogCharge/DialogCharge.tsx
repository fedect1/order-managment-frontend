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
import { FormCreateCharge } from "../FormCreateCharge"
import { DialogChargeProps } from "./DialogCharge.interface"


export function DialogCharge( {materials}: DialogChargeProps ) {
    const[openModalCreate, setOpenModalCreate] = useState(false)

  return (
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

      <FormCreateCharge setOpenModalCreate={setOpenModalCreate} materials={materials} />

    </DialogContent>
  </Dialog>
  )
}
