// Si prefieres usar un Server Component:
// src/app/(routes)/orders/components/CardOrderLine/CardOrderLine.tsx

import { DropAndDrag } from "../DropAndDrag";
import { LineData } from './DropAndDrag.interface';
import prisma from "@/lib/prisma";
import { OrderStatus } from '@prisma/client';

async function getCurrentOrder(lineId: number) {
  try {
    const currentOrder = await prisma.t_ng_orders.findFirst({
      where: {
        linea_id: lineId,
        status: 'ACTIVE' as OrderStatus
      }
    });
    
    return currentOrder;
  } catch (error) {
    console.error('Error fetching current order:', error);
    return null;
  }
}

export async function CardOrderLine({line, color, id}: LineData) {
  let orderNumber = 'Brak aktywnego zamówienia';
  
  if (id) {
    const currentOrder = await getCurrentOrder(id);
    if (currentOrder) {
      orderNumber = currentOrder.job_number;
    }
  }
  
  const getColorStyle = () => {
    if (!color) return { backgroundColor: '#3B82F6' };
    const hexColor = '#' + Number(color).toString(16).padStart(6, '0');
    return { backgroundColor: hexColor };
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center p-3 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm flex-shrink-0" style={getColorStyle()}></div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">{line}</h3>
        </div>
        <div className="flex items-center gap-2">
          <h4 className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Aktualne zamówienie:
          </h4>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
            {orderNumber}
          </span>
        </div>
      </div>
      
      <div className="p-2">
        <DropAndDrag id={id} />
      </div>
    </div>
  );
}