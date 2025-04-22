'use client'
import { useState, useEffect } from 'react';
import { Reorder } from "framer-motion";

interface OrderData {
  order_id: number;
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
  const [items, setItems] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders when component mounts
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Add the lineId and status=2 (WAITING) as query parameters
        const response = await fetch(`/api/orders?lineId=${id}&status=1`, {
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
          console.log(data);
          if (data.data.length > 0) {
            setItems(data.data);
          } else {
            // Create a placeholder item for empty data
            setItems([{
              order_id: -1,
              job_number: "Nie znaleziono aktywnych zamówień",
              product_number: "",
              quantity_kg: 0,
              linea_id: id,
              status: "",
              sequence_number: 0
            }]);
          }
        } else {
          // If no orders or error, set default state
          setItems([{
            order_id: -1,
            job_number: "No active orders available",
            product_number: "",
            quantity_kg: 0,
            linea_id: id,
            status: "",
            sequence_number: 0
          }]);
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
        setItems([{
          order_id: -1,
          job_number: "Error loading orders",
          product_number: "",
          quantity_kg: 0,
          linea_id: id,
          status: "",
          sequence_number: 0
        }]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrders();
    } else {
      // If no id is provided, use default items
      setItems([
        { order_id: 1, job_number: "AB-111", product_number: "AB-111", quantity_kg: 0, linea_id: 0, status: "", sequence_number: 1 },
        { order_id: 2, job_number: "AB-222", product_number: "AB-222", quantity_kg: 0, linea_id: 0, status: "", sequence_number: 2 },
        { order_id: 3, job_number: "AB-333", product_number: "AB-333", quantity_kg: 0, linea_id: 0, status: "", sequence_number: 3 },
        { order_id: 4, job_number: "AB-444", product_number: "AB-444", quantity_kg: 0, linea_id: 0, status: "", sequence_number: 4 },
        { order_id: 5, job_number: "AB-555", product_number: "AB-555", quantity_kg: 0, linea_id: 0, status: "", sequence_number: 5 },
      ]);
      setLoading(false);
    }
  }, [id]); // Re-run when id changes

  // Handle reordering and log the new order with necessary information
  const handleReorder = async (newItems: OrderData[]) => {
    setItems(newItems);
    
    // Ignore placeholder items (those with order_id = -1)
    if (newItems.length === 1 && newItems[0].order_id === -1) {
      return;
    }
    
    // Create an array with the reordered information (index, order_id, job_number)
    const reorderedArray = newItems.map((item, index) => ({
      index,
      order_id: item.order_id,
      job_number: item.job_number
    }));
    
    // Log the reordered array locally
    console.log("New order (local):", reorderedArray);
    
    // Send the reordered data to the server via PATCH
    try {
      const response = await fetch('/api/orders/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineId: id,
          reorderedItems: reorderedArray
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order sequence');
      }
      
      const result = await response.json();
      console.log('Server response:', result);
      
    } catch (err) {
      console.error('Error updating order sequence:', err);
    }
  };

  if (loading) {
    return <div className="py-4 text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-2 py-1">
      <Reorder.Group values={items} onReorder={handleReorder} className="space-y-2">
        {items.map((item, index) => (
          <Reorder.Item 
            value={item} 
            key={item.order_id.toString()}
            className="cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-md p-2 border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all duration-200">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-200">{index + 1}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Order #{item.order_id}</p>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{item.job_number}</p>
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