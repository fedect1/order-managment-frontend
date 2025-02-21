
import { LineSummaryProps } from "./LineSummary.interface"; 

export function LineSummary(props: LineSummaryProps)  {
    const {line, color, status, lastOrder, currentOrder, followingOrder } = props
    const lineColor = { backgroundColor: color };
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 py-3">
        <div className="flex justify-between py-3 border-b">
            <div className="flex gap-2 items-center">
                <div className={`w-7 h-7 rounded-lg border border-black dark:border-white`} style={lineColor}></div>
                {line}    
            </div>
            <div className="flex gap-4 items-center">
                <p className="text-2xl">
                    {status}
                </p>
            </div>
        </div>
        <div className="">
            <div className="flex justify-between py-3 border-b">
                <p>Last Order</p>
                <p>{lastOrder}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
                <p>Current Order</p>
                <p>{currentOrder}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
                <p>Following Order</p>
                <p>{followingOrder}</p>
            </div>
        </div>
    </div>
  )
}
