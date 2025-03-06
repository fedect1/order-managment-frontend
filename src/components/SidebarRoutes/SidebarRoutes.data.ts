import {
    BarChart4,
    Building2,
    PanelsTopLeft,
    CircleHelpIcon,
    Calendar,
    Container,
    Box,
    Cog
} from 'lucide-react'

export const dataGeneralSidebar = [
    {
        icon: PanelsTopLeft,
        label: "Overview",
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
    {
        icon: Calendar,
        label: "Calendar",
        href: "/task"
    },
]
