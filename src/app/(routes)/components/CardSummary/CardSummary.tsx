import { CustomIcon } from "@/components/CustomIcon";
import { CardSummaryProps } from "./CardSummary.interface";
import { CustomTooltip } from '../../../../components/CustomTooltip/CustomTooltip';
import { cn } from "@/lib/utils";
import { MoveDownRight, MoveUpRight, TrendingUp } from "lucide-react";

export function CardSummary(props: CardSummaryProps)  {
    const {average, icon: Icon, title, tooltipText, total} = props
    const color = { backgroundColor: "#777777" };
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 py-3">
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <div className={`w-7 h-7 rounded-lg`} style={color}></div>
                <CustomIcon icon={Icon}/>
                {title}    
                <CustomTooltip content={tooltipText}/>
            </div>
            <div className="flex gap-4 items-center">
                <p className="text-2xl">
                    {total}
                </p>
                <div className={cn(`flex items-center gap-1 px-2 text-xs text-white rounded-lg h-[20px] bg-black dark:bg-secondary`)}>
                    {average}%
                    {
                        average < 20 && (
                            <MoveDownRight strokeWidth={2} className="h-4 w-4"/>
                        )
                    }
                    {
                        average > 20 && average < 70 && (
                            <MoveUpRight strokeWidth={2} className="h-4 w-4"/>
                        )
                    }
                    {
                        average > 70 && average < 100 && (
                            <TrendingUp strokeWidth={2} className="h-4 w-4"/>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}
