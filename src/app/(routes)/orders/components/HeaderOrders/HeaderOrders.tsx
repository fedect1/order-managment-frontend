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

import { CirclePlus } from "lucide-react"

import { useState } from "react"
import { FormCreateCustomer } from "../FormCreateCustomer"

export function HeaderOrders() {
  const[openModalCreate, setOpenModalCreate] = useState(false)
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">List of Orders</h2>
      <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Create Order</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
              <DialogTitle>Create Order</DialogTitle>
              <DialogDescription>
                Create and configure your Order
              </DialogDescription>
          </DialogHeader>

          <FormCreateCustomer setOpenModalCreate={setOpenModalCreate} />

        </DialogContent>
      </Dialog>
    </div>
  )
}
