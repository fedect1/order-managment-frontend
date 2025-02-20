import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Menu, Search } from "lucide-react"

import { SidebarRoutes } from "@/components/SidebarRoutes"
import { ToggleTheme } from "@/components/ToggleTheme"


export function Navbar() {
  return (
    <nav className="flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20">
        <div className="block xl:hidden">
            <Sheet>
                <SheetTrigger className="flex items-center">
                    <Menu/>
                </SheetTrigger>
                <SheetContent>
                    <SidebarRoutes/>
                </SheetContent>
            </Sheet>    
        </div>
        <div className="relative w-[300px]">
            <Input placeholder="search..." className="rounded-lg"/>
            <Search strokeWidth={1} className="absolute top-2 right-2"/>
        </div>
        <div>
            <ToggleTheme/>
            {/* Agregar avatar */}
        </div>
    </nav>
  )
}
