// src/app/api/lines/[id]/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { lineVersionService } from '@/services/lineVersionService';
import { OrderStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lineId = parseInt(params.id);
    if (isNaN(lineId)) {
      return NextResponse.json(
        { success: false, message: 'ID de línea inválido' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { orderSequence, clientVersion } = body;
    
    if (!Array.isArray(orderSequence) || orderSequence.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Secuencia de órdenes inválida' },
        { status: 400 }
      );
    }
    
    // Procesar en una transacción
    return await prisma.$transaction(async (tx) => {
      // 1. Verificar que la versión del cliente coincide con la del servidor
      const versionMatch = await lineVersionService.verifyLineVersion(lineId, clientVersion);
      
      if (!versionMatch) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Los datos han cambiado. Por favor, actualice la página.' 
          },
          { status: 409 } // Conflict
        );
      }
      
      // 2. Obtener todas las órdenes actuales para esta línea
      const lineOrders = await tx.t_ng_orders.findMany({
        where: { 
          linea_id: lineId,
          status: { 
            in: ['WAITING', 'ACTIVE'] as OrderStatus[]
          },
        },
        orderBy: { sequence_number: 'asc' },
      });
      
      // 3. Verificar que todas las órdenes existen
      const currentOrderIds = lineOrders.map(o => o.order_id);
      const allOrdersExist = orderSequence.every(id => currentOrderIds.includes(id));
      
      if (!allOrdersExist || orderSequence.length !== currentOrderIds.length) {
        return NextResponse.json(
          { success: false, message: 'Secuencia inválida: las órdenes no coinciden' },
          { status: 400 }
        );
      }
      
      // 4. Verificar que la orden activa (primera en secuencia) sigue siendo la misma
      const activeOrder = lineOrders.find(o => o.status === 'ACTIVE'); // Activa
      if (activeOrder && orderSequence[0] !== activeOrder.order_id) {
        return NextResponse.json(
          { success: false, message: 'No se puede cambiar la posición de la orden activa' },
          { status: 400 }
        );
      }
      
      // 5. Actualizar la secuencia según la nueva ordenación
      for (let i = 0; i < orderSequence.length; i++) {
        const orderId = orderSequence[i];
        const newPosition = i + 1;
        
        await tx.t_ng_orders.update({
          where: { order_id: orderId },
          data: { 
            sequence_number: newPosition,
            // Asegurar que la primera orden está ACTIVE y las demás WAITING
            status: newPosition === 1 ? ('ACTIVE' as OrderStatus) : ('WAITING' as OrderStatus)
          }
        });
      }
      
      // 6. Generar y guardar nueva versión
      const newVersion = await lineVersionService.updateLineVersion(tx, lineId);
      
      return NextResponse.json({ 
        success: true,
        newVersion: newVersion
      });
    });
    
  } catch (error) {
    console.error('Error reordering queue:', error);
    return NextResponse.json(
      { success: false, message: 'Error al reordenar la cola' },
      { status: 500 }
    );
  }
}