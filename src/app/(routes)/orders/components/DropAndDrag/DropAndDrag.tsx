'use client'
import { useState } from 'react';
import { Reorder } from "framer-motion"

export function DropAndDrag() {
  const [items, setItems] = useState(["AB-111", "AB-222", "AB-333", "AB-444", "AB-555"])
  
  return (
    <div className="space-y-2 py-1">
      <Reorder.Group values={items} onReorder={setItems} className="space-y-2">
        {items.map((item, index) => (
          <Reorder.Item 
            value={item} 
            key={item}
            className="cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-md p-2 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all duration-200">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-200">{index + 1}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Order</p>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}