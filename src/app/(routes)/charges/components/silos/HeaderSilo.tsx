"use client"

import { DialogBulk } from "./DialogBulk"


export function HeaderSilo() {

  return (
    <div className="flex items-center justify-between pb-2">
      <h2 className="text-2xl">Silos</h2>
      <DialogBulk/>
    </div>
  )
}
