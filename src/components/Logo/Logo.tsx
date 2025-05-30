"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export function Logo() {
    const router = useRouter()
  return (
    <div className="min-h-20 h-20 flex items-center border-b cursor-pointer gap-2 p-3" onClick={()=>router.push("/")}>

        <Image src="/logo.png" alt="Logo" width={70} height={50} priority className="dark:invert"/>

        <h1 className="font-bold text-xl">Order manager</h1>
    </div>
  )
}
