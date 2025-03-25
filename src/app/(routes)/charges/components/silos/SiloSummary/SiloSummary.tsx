
import { Silo } from "@/components/SiloIcon";
import { SiloSummaryProps } from "./SiloSummary.interface";

export function SiloSummary(props: SiloSummaryProps)  {
    const { SILO_NAME, SILO_QUANTITY, SILO_CHARGE, SILO_CAPACITY, RAWMAT_NAME, RAWMAT_RAWTYP } = props
    const perc =  SILO_QUANTITY / SILO_CAPACITY * 100
  return (
    <div className="shadow-sm bg-background border rounded-lg p-1 py-3">
        <div className="flex justify-between py-3">
            <div className="flex gap-2 items-center">
                <div style={{ width: '200px', height: '250px', display: 'inline-block', margin: '10px' }}>
                    <Silo fillPercentage={perc} name={ SILO_NAME }/>
                </div>
            </div>
        </div>
            <div className="shadow-sm bg-background rounded-lg p-5 py-3">
                <div className="shadow-2xl bg-white dark:bg-gray-800 rounded-lg p-3 transition-all hover:shadow-lg">
                    
                    {/* Current Order */}
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 text-sm">
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Charge</p>
                        <div className="flex items-center gap-1">
                        <p className="font-semibold">{SILO_CHARGE}</p>
                        </div>
                    </div>
                    
                    {/* Throughput Section */}
                    <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">Material</h3>
                        <div className="grid grid-cols-2 gap-2">
                        <div className="p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                            <p className="font-semibold text-xs">{RAWMAT_NAME}</p>
                        </div>
                        <div className="p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                            <p className={`font-semibold text-xs`}>
                            {RAWMAT_RAWTYP}
                            </p>
                        </div>
                        </div>
                    </div>
                    
                    {/* Amount Section */}
                    <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">Amount</h3>
                        <div className="grid grid-cols-2 gap-2">
                        <div className="p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Capacity</p>
                            <p className="font-semibold text-xs">{SILO_CAPACITY}</p>
                        </div>
                        <div className="p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                            <p className={`font-semibold text-xs`}>
                            {SILO_QUANTITY}
                            </p>
                        </div>
                        </div>
                    </div>
                    
                    
                    </div>
         </div>
        
    </div>
  )
}
