"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { CreateBulkForm } from "../CreateBulkForm"


export function DialogBulk() {
    const[openModalCreate, setOpenModalCreate] = useState(false)
  return (
    <Dialog open={openModalCreate} onOpenChange={setOpenModalCreate} >
        <DialogTrigger asChild>
            <Button>Create bulk</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
            <DialogTitle>Create Bulk</DialogTitle>
            <DialogDescription>
                Create and configure your new Bulk
            </DialogDescription>
            </DialogHeader>
            <CreateBulkForm setOpenModalCreate={setOpenModalCreate}/>
        </DialogContent>
    </Dialog>
  )
}
