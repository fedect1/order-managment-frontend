// src/app/api/orders/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { lineVersionService } from '@/services/lineVersionService';
import { OrderStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, message: 'ID de orden inválido' },
        { status: 400 }
      );
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Obtener la orden
      const order = await tx.t_ng_orders.findUnique({
        where: { order_id: orderId }
      });

      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Orden no encontrada' },
          { status: 404 }
        );
      }

      // 2. No permitir cancelar órdenes ya completadas
      if (order.status === 'COMPLETED') {
        return NextResponse.json(
          { success: false, message: 'No se pueden cancelar órdenes ya completadas' },
          { status: 400 }
        );
      }

      const currentPosition = order.sequence_number;
      const lineId = order.linea_id;
      const wasActive = order.status === 'ACTIVE';

      // 3. Marcar la orden como cancelada
      await tx.t_ng_orders.update({
        where: { order_id: orderId },
        data: {
          status: 'CANCELLED' as OrderStatus,
          is_cancelled: true,
          sequence_number: 0 // Sacar de la secuencia
        }
      });

      // 4. Reajustar las posiciones según el estado de la orden cancelada
      if (wasActive) {
        // Si era la activa, avanzar todas las órdenes en espera
        await tx.t_ng_orders.updateMany({
          where: {
            linea_id: lineId,
            status: 'WAITING' as OrderStatus,
          },
          data: {
            sequence_number: {
              decrement: 1
            }
          }
        });

        // Activar la que ahora es la primera
        await tx.t_ng_orders.updateMany({
          where: {
            linea_id: lineId,
            sequence_number: 1,
            status: 'WAITING' as OrderStatus
          },
          data: {
            status: 'ACTIVE' as OrderStatus
          }
        });
      } else {
        // Si era una orden en espera, solo reajustar posiciones
        await tx.t_ng_orders.updateMany({
          where: {
            linea_id: lineId,
            status: 'WAITING' as OrderStatus,
            sequence_number: { gt: currentPosition }
          },
          data: {
            sequence_number: {
              decrement: 1
            }
          }
        });
      }

      // 5. Actualizar versión de la línea
      const newVersion = await lineVersionService.updateLineVersion(tx, lineId);

      return NextResponse.json({ 
        success: true,
        newVersion: newVersion
      });
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { success: false, message: 'Error al cancelar la orden' },
      { status: 500 }
    );
  }
}