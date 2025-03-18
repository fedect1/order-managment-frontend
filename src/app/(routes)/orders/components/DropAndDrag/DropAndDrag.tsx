'use client'
import { useState, useEffect } from 'react';
import { Reorder } from "framer-motion";

interface OrderData {
  job_number: string;
  product_number: string;
  quantity_kg: number;
  linea_id: number;
  status: string;
  sequence_number: number;
}

interface DropAndDragProps {
  id: number;
}

export function DropAndDrag({ id }: DropAndDragProps) {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders when component mounts
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Add the lineId and status=2 (ACTIVE) as query parameters
        const response = await fetch(`/api/orders?lineId=${id}&status=2`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Map the orders to the format you need
          const orderItems = data.data.map((order: OrderData) => order.job_number);
          setItems(orderItems.length > 0 ? orderItems : ["No active orders found"]);
        } else {
          // If no orders or error, set default state
          setItems(["No active orders available"]);
        }
      } catch (err: unknown) {
        console.error('Error fetching orders:', err);
        // Properly handle the unknown error type
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        // Set default items in case of error
        setItems(["Error loading orders"]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrders();
    } else {
      // If no id is provided, use default items
      setItems(["AB-111", "AB-222", "AB-333", "AB-444", "AB-555"]);
      setLoading(false);
    }
  }, [id]); // Re-run when id changes

  if (loading) {
    return <div className="py-4 text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">Error: {error}</div>;
  }

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
  );
}