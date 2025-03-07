import { LineSummaryProps } from "./LineSummary.interface";
import { CurrentOrderTooltip } from "../CurrentOrderTooltip";

export function LineSummary(props: LineSummaryProps) {
  const {
    line,
    color,
    status,
    lastOrder,
    currentOrder,
    followingOrder,
    amountAct,
    amountTgt,
    throughputAct,
    throughputTgt,
    TooltipInfo
  } = props;
  
  const lineColor = { backgroundColor: color };
  
  // Calcular diferencias y remainder
  const throughputDiff = typeof throughputAct === 'number' && typeof throughputTgt === 'number' 
    ? ((throughputAct - throughputTgt) / throughputTgt) * 100 
    : 0;
    
  // Calcular remainder (cantidad restante)
  const remainder = typeof amountTgt === 'number' && typeof amountAct === 'number' 
    ? amountTgt - amountAct 
    : 0;
    
  // Calcular porcentaje del remainder respecto al target
  const remainderPercentage = typeof amountTgt === 'number' && amountTgt !== 0 
    ? (remainder / amountTgt) * 100 
    : 0;
    
  // Determinar color del remainder según porcentaje
  const getRemainderColor = () => {
    if (remainderPercentage < 10) return "text-red-600 dark:text-red-400";
    if (remainderPercentage < 30) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };
  
  // Comprobar si está fuera del rango de ±2%
  const isThroughputOutOfRange = Math.abs(throughputDiff) > 2;
  
  return (
    <div className="shadow-md bg-white dark:bg-gray-800 rounded-lg p-3 transition-all hover:shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 items-center">
          <div
            className="w-6 h-6 rounded-md shadow-sm flex-shrink-0"
            style={lineColor}
          />
          <h3 className="font-medium">{line}</h3>
        </div>
        <div className="flex items-center">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
            ${status === "Running" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : 
              status === "Stopped" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : 
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
            {status}
          </span>
        </div>
      </div>
      
      {/* Current Order */}
      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 text-sm">
        <p className="text-gray-600 dark:text-gray-400 font-medium">Current Order</p>
        <div className="flex items-center gap-1">
          <p className="font-semibold">{currentOrder}</p>
          {TooltipInfo && <CurrentOrderTooltip tooltipInfo={TooltipInfo} />}
        </div>
      </div>
      
      {/* Throughput Section */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">Throughput</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Target [kg/h]</p>
            <p className="font-semibold text-sm">{throughputTgt ?? '-'}</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Actual [kg/h]</p>
            <p className={`font-semibold text-sm ${isThroughputOutOfRange ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
              {throughputAct ?? '-'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Amount Section */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">Amount</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Target [kg]</p>
            <p className="font-semibold text-sm">{amountTgt ?? '-'}</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Remainder [kg]</p>
            <p className={`font-semibold text-sm ${getRemainderColor()}`}>
              {remainder.toFixed(1) ?? '-'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Order Info */}
      <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Last Order</p>
          <p className="font-semibold truncate">{lastOrder ?? '-'}</p>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Following Order</p>
          <p className="font-semibold truncate">{followingOrder ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}