import {
    BarChart4,
    Building2,
    PanelsTopLeft,
    CircleHelpIcon,
    Calendar,
    Box,
    Cog
} from 'lucide-react'

export const dataGeneralSidebar = [
    {
        icon: PanelsTopLeft,
        label: "Przegląd",
        href: "/"
    },
    {
        icon: Building2,
        label: "Zamówienia",
        href: "/orders"
    },
    {
        icon: Box,
        label: "Materiały",
        href: "/materials"
    },
    {
        icon: Cog,
        label: "Receptury",
        href: "/recipes"
    },
//     {
//         icon: Container,
//         label: "Charge Assignment",
//         href: "/charges"
//     },
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
