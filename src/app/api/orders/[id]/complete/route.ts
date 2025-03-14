// src/app/api/orders/[id]/complete/route.ts
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

      // 2. Verificar que esté activa
      if (order.status !== 'ACTIVE') {
        return NextResponse.json(
          { success: false, message: 'Solo se pueden completar órdenes en proceso' },
          { status: 400 }
        );
      }

      const lineId = order.linea_id;

      // 3. Marcar como completada
      await tx.t_ng_orders.update({
        where: { order_id: orderId },
        data: {
          status: 'COMPLETED' as OrderStatus,
          sequence_number: 0 // Ya no forma parte de la secuencia
        }
      });

      // 4. Avanzar las posiciones de todas las órdenes en espera
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

      // 5. Activar la siguiente orden en la cola
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

      // 6. Actualizar versión de la línea
      const newVersion = await lineVersionService.updateLineVersion(tx, lineId);

      return NextResponse.json({ 
        success: true,
        newVersion: newVersion
      });
    });
  } catch (error) {
    console.error('Error completing order:', error);
    return NextResponse.json(
      { success: false, message: 'Error al completar la orden' },
      { status: 500 }
    );
  }
}