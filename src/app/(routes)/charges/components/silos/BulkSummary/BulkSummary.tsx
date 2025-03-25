

export function BulkSummary() {

  return (
    <div className="shadow-sm bg-background rounded-lg p-5 py-3">
            <div className="shadow-2xl bg-white dark:bg-gray-800 rounded-lg p-3 transition-all hover:shadow-lg">
                  
                  {/* Current Order */}
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 text-sm">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Charge</p>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold">ARG-01</p>
                    </div>
                  </div>
                  
                  {/* Throughput Section */}
                  <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">Material</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                        <p className="font-semibold text-xs">Recycle</p>
                      </div>
                      <div className="p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                        <p className={`font-semibold text-xs`}>
                          PR1
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
                        <p className="font-semibold text-xs">1000 kg</p>
                      </div>
                      <div className="p-1 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                        <p className={`font-semibold text-xs`}>
                          300kg
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  
                </div>
        </div>
  )
}
