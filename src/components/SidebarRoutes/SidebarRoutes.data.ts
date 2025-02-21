import {
    BarChart4,
    Building2,
    PanelsTopLeft,
    Settings,
    ShieldCheck,
    CircleHelpIcon,
    Calendar,
    Container
} from 'lucide-react'

export const dataGeneralSidebar = [
    {
        icon: PanelsTopLeft,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Building2,
        label: "List of orders",
        href: "/orders"
    },
    {
        icon: Container,
        label: "Materials",
        href: "/materials"
    },
    {
        icon: Calendar,
        label: "Calendar",
        href: "/task"
    },
]

export const dataToolsSidebar = [
    {
        icon: CircleHelpIcon,
        label: "Faqs",
        href: "/faqs"
    },
    {
        icon: BarChart4,
        label: "Analytics",
        href: "/analytics"
    },
]

export const dataSupportSidebar = [
    {
        icon: Settings,
        label: "Setting",
        href: "/setting"
    },
    {
        icon: ShieldCheck,
        label: "Security",
        href: "/security"
    },
]