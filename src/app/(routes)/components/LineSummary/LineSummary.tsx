import { LineSummaryProps } from "./LineSummary.interface";

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
    throughputTgt
  } = props;
  
  const lineColor = { backgroundColor: color };
  const isOverTarget = typeof throughputAct === 'number' && typeof throughputTgt === 'number' ? throughputAct > throughputTgt : false;
  
  return (
    <div className="shadow-lg bg-white dark:bg-gray-800 rounded-xl p-5 transition-all hover:shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-3 items-center">
          <div
            className="w-8 h-8 rounded-md shadow-sm flex-shrink-0"
            style={lineColor}
          />
          <h3 className="font-medium text-lg">{line}</h3>
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium 
            ${status === "Running" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : 
              status === "Stopped" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : 
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
            {status}
          </span>
        </div>
      </div>
      
      {/* Current Order */}
      <div className="flex justify-between py-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 font-medium">Current Order</p>
        <p className="font-semibold">{currentOrder}</p>
      </div>
      
      {/* Throughput Section */}
      <div className="py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Throughput</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Target [kg/h]</p>
            <p className="font-semibold">{throughputTgt ?? '-'}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Actual [kg/h]</p>
            <p className={`font-semibold ${isOverTarget ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {throughputAct ?? '-'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Amount Section */}
      <div className="py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Amount</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Actual [kg]</p>
            <p className="font-semibold">{amountAct ?? '-'}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Target [kg]</p>
            <p className="font-semibold">{amountTgt ?? '-'}</p>
          </div>
        </div>
      </div>
      
      {/* Order Info */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Order</p>
          <p className="font-semibold truncate">{lastOrder ?? '-'}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Following Order</p>
          <p className="font-semibold truncate">{followingOrder ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}