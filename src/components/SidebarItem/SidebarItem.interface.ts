import { LucideIcon } from "lucide-react"

export interface SidebarItemProps {
    item: {
        label: string,
        icon: LucideIcon,
        href: string,
    },
    key: string
}