
import { SiloSummaryProps } from "./SiloSummary.interface";
import { Progress } from "@/components/ui/progress"
import { Percent } from 'lucide-react';


export function SiloSummary(props: SiloSummaryProps)  {
    const { SILO_NAME, SILO_QUANTITY, SILO_CHARGE, SILO_CAPACITY, SILO_CATEGORY } = props
    const perc =  SILO_QUANTITY / SILO_CAPACITY * 100
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 py-3">
        <div className="flex justify-between py-3 border-b">
            <div className="flex gap-2 items-center">
                {SILO_NAME}    
            </div>
            <div className="flex gap-4 items-center">
                <p className="text-2xl">
                    {SILO_QUANTITY}
                </p>
            </div>
        </div>
        <div className="">
        <div className="flex items-center justify-between py-3 border-b">
            <div className="w-2/3">
                <Progress value={perc} className="h-2 rounded " />
            </div>
            <div className="flex items-center space-x-1">
                <p>{perc}</p>
                <Percent strokeWidth={1} className="w-4 h-4" />
            </div>
        </div>

            <div className="flex justify-between py-3 border-b">
                <p>Current Order</p>
                <p>{SILO_CAPACITY}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
                <p>Following Order</p>
                <p>{SILO_CATEGORY}</p>
            </div>
        </div>
    </div>
  )
}
