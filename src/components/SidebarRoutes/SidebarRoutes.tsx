'use client'

import { SidebarItem } from "../SidebarItem"
import { Separator } from "@/components/ui/separator"
import { dataGeneralSidebar} from "./SidebarRoutes.data"
import { Button } from "@/components/ui/button"
export function SidebarRoutes() {
  return (
    <div className="flex flex-col justify-between">
        <div>
            <div className="p-2 md:p-6">
                <p className="text-slate-500 mb-2">General</p>
                {dataGeneralSidebar.map((item)=>(
                    <SidebarItem key={item.label} item={item}/>
                ))}
            </div>

            {/* <Separator/>

            <div className="p-2 md:p-6">
                <p className="text-slate-500 mb-2">Tools</p>
                {dataToolsSidebar.map((item)=>(
                    <SidebarItem key={item.label} item={item}/>
                ))}
            </div>

            <Separator/> */}


        </div>
        <div>
            <div className="text-center p-6">
                <Button variant="outline" className="w-full">
                    Inno-Plast GmbH
                </Button>
            </div>

            <Separator/>

            <footer className="mt-3 p-3 text-center">
                2025. All rights reserved
            </footer>
        </div>
    </div>
  )
}
