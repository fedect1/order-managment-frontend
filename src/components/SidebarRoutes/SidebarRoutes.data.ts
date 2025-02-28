import {
    BarChart4,
    Building2,
    PanelsTopLeft,
    Settings,
    ShieldCheck,
    CircleHelpIcon,
    Calendar,
    Container,
    Box,
    Cog
} from 'lucide-react'

export const dataGeneralSidebar = [
    {
        icon: PanelsTopLeft,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Building2,
        label: "Orders",
        href: "/orders"
    },
    {
        icon: Box,
        label: "Materials",
        href: "/materials"
    },
    {
        icon: Cog,
        label: "Recipes",
        href: "/recipes"
    },
    {
        icon: Container,
        label: "Charge Assignment",
        href: "/charges"
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
    // {
    //     icon: Settings,
    //     label: "Setting",
    //     href: "/setting"
    // },
    // {
    //     icon: ShieldCheck,
    //     label: "Security",
    //     href: "/security"
    // },
]