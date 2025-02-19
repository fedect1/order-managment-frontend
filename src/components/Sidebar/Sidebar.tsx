import { Logo } from "@/components/Logo";
import { SidebarRoutes } from "@/components/SidebarRoutes";

export function Sidebar() {
  return (
    <div className="h-screen">
        <div className="h-full flex flex-col border-r">
            <Logo/>
            <SidebarRoutes/>
        </div>
    </div>
  )
}
