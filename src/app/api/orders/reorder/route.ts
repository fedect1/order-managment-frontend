import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const lineaId = searchParams.get('lineaId');
    const position = searchParams.get('position');

    // Validar parámetros
    if (!orderId || !position || !lineaId) {
      return NextResponse.json(
        { success: false, message: 'Required parameters: orderId, lineaId and position' },
        { status: 400 }
      );
    }

    const orderIdNum = parseInt(orderId);
    const newPosition = parseInt(position);
    const lineIdNum = parseInt(lineaId);
    
    return await prisma.$transaction(async (tx) => {
      // Obtener todos los pedidos de la línea con estado WAITING
      const arrOrdAndSec = await tx.t_ng_orders.findMany({
        where: {
          linea_id: lineIdNum,
          status: {
            in: ['WAITING'] as OrderStatus[]
          },
        },
        orderBy: {
          sequence_number: 'asc' // Ordenar ascendente para facilitar el procesamiento
        },
        select: {
          order_id: true,
          sequence_number: true,
        }
      });

      // Validar posición - debe estar entre 2 y length+1 (para mantener consecutivos desde 2)
      if (newPosition < 2 || newPosition > arrOrdAndSec.length + 1) {
        return NextResponse.json(
          { success: false, message: `Invalid position: ${newPosition}. Must be between 2 and ${arrOrdAndSec.length + 1}` },
          { status: 400 }
        );
      }

      // Encontrar el pedido a mover
      const foundOrder = arrOrdAndSec.find(order => order.order_id === orderIdNum);
      if (!foundOrder) {
        return NextResponse.json(
          { success: false, message: `Order with ID ${orderIdNum} not found in line ${lineIdNum}` },
          { status: 404 }
        );
      }

      const current_pos = foundOrder.sequence_number;
      
      // Si la posición actual es igual a la nueva, no hacer nada
      if (current_pos === newPosition) {
        return NextResponse.json(
          { success: false, message: `Cannot change position because it is already the current one` },
          { status: 400 }
        );
      }

      // Primero, normalizar las secuencias para asegurar que sean consecutivas desde 2
      // Crear un mapeo de posiciones actuales a posiciones normalizadas
      const normalizedPositions = new Map();
      
      // Ordenar los pedidos por sequence_number
      const sortedOrders = [...arrOrdAndSec].sort((a, b) => a.sequence_number - b.sequence_number);
      
      // Asignar nuevas posiciones consecutivas desde 2
      for (let i = 0; i < sortedOrders.length; i++) {
        normalizedPositions.set(sortedOrders[i].order_id, i + 2); // +2 porque empezamos desde 2
      }
      
      // Obtener la posición normalizada actual del pedido a mover
      const normalizedCurrentPos = normalizedPositions.get(orderIdNum);
      
      // Actualizar la matriz de secuencias con valores normalizados
      const updatePromises = [];
      
      // Caso 1: Mover a una posición anterior (ejemplo: de 5 a 2)
      if (newPosition < normalizedCurrentPos) {
        for (const item of arrOrdAndSec) {
          const normalizedPos = normalizedPositions.get(item.order_id);
          if (item.order_id !== orderIdNum) {
            if (normalizedPos >= newPosition && normalizedPos < normalizedCurrentPos) {
              // Incrementar la secuencia
              updatePromises.push(
                tx.t_ng_orders.update({
                  where: { order_id: item.order_id },
                  data: { sequence_number: normalizedPos + 1 }
                })
              );
            } else if (normalizedPos < newPosition || normalizedPos > normalizedCurrentPos) {
              // Normalizar el resto de posiciones si difieren de las consecutivas
              updatePromises.push(
                tx.t_ng_orders.update({
                  where: { order_id: item.order_id },
                  data: { sequence_number: normalizedPos }
                })
              );
            }
          }
        }
      } 
      // Caso 2: Mover a una posición posterior (ejemplo: de 2 a 5)
      else {
        for (const item of arrOrdAndSec) {
          const normalizedPos = normalizedPositions.get(item.order_id);
          if (item.order_id !== orderIdNum) {
            if (normalizedPos > normalizedCurrentPos && normalizedPos <= newPosition) {
              // Decrementar la secuencia
              updatePromises.push(
                tx.t_ng_orders.update({
                  where: { order_id: item.order_id },
                  data: { sequence_number: normalizedPos - 1 }
                })
              );
            } else if (normalizedPos < normalizedCurrentPos || normalizedPos > newPosition) {
              // Normalizar el resto de posiciones si difieren de las consecutivas
              updatePromises.push(
                tx.t_ng_orders.update({
                  where: { order_id: item.order_id },
                  data: { sequence_number: normalizedPos }
                })
              );
            }
          }
        }
      }

      // Actualizar la posición del pedido objetivo
      updatePromises.push(
        tx.t_ng_orders.update({
          where: { order_id: orderIdNum },
          data: { sequence_number: newPosition }
        })
      );

      // Ejecutar todas las actualizaciones
      await Promise.all(updatePromises);

      // Obtener la lista actualizada para confirmar los cambios
      const updatedOrders = await tx.t_ng_orders.findMany({
        where: {
          linea_id: lineIdNum,
          status: {
            in: ['WAITING'] as OrderStatus[]
          },
        },
        orderBy: { sequence_number: 'asc' },
        select: {
          order_id: true,
          sequence_number: true,
        }
      });

      return NextResponse.json(
        { 
          success: true, 
          message: `Order ${orderIdNum} moved from position ${current_pos} to ${newPosition}`,
          data: updatedOrders 
        },
        { status: 200 }
      );
    });
  } catch (error) {
    console.error('Error updating order position:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating order position' },
      { status: 500 }
    );
  }
}