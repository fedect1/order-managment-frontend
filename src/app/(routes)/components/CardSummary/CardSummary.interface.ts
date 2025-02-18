import { LucideIcon } from "lucide-react";

export interface CardSummaryProps {
    icon: LucideIcon;
    total: string,
    average: number;
    title: string;
    tooltipText: string;
}