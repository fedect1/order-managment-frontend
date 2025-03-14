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
import { FormCreateOrder } from "../FormCreateOrder"
import { LineData, RecipeData } from "../FormCreateOrder/FormCreateOrder.interface"


interface HeaderOrderProps {
  lineList: LineData[],
  recipeList: RecipeData[]
}

export function HeaderOrders({lineList, recipeList}:HeaderOrderProps) {
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

          <FormCreateOrder setOpenModalCreate={setOpenModalCreate} lineList={lineList} recipeList={recipeList} />

        </DialogContent>
      </Dialog>
    </div>
  )
}
