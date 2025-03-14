// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { lineVersionService } from '@/services/lineVersionService';
import { z } from 'zod';
import { OrderStatus, Prisma } from '@prisma/client';

// Esquema de validación para crear órdenes
const orderSchema = z.object({
  job_number: z.string().min(2),
  product_number: z.string().min(2),
  quantity_kg: z.coerce.number().positive(),
  consumption_kg_h: z.coerce.number().positive(),
  pml_target_g_m: z.coerce.number().positive(),
  width_mm: z.coerce.number().int().positive(),
  gusset_mm: z.coerce.number().int().positive(),
  linea_id: z.coerce.number().int().positive(),
  recipe_uuid: z.string().optional(),
});

// Mapeo de valores numéricos a los valores de enum de OrderStatus
const mapNumberToOrderStatus = (value: number): OrderStatus => {
  switch (value) {
    case 0:
      return 'COMPLETED' as OrderStatus;
    case 1:
      return 'WAITING' as OrderStatus;
    case 2:
      return 'ACTIVE' as OrderStatus;
    case 3:
      return 'PENDING' as OrderStatus;
    case 4:
      return 'CANCELLED' as OrderStatus;
    default:
      throw new Error(`Invalid status value: ${value}`);
  }
};

// GET: Obtener todas las órdenes
export async function GET(request: NextRequest) {
  try {
    // Parámetros de filtro (opcionales)
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get('lineId');
    const status = searchParams.get('status');

    const whereClause: Prisma.t_ng_ordersWhereInput = {};
    
    if (lineId) {
      whereClause.linea_id = parseInt(lineId);
    }
    
    if (status) {
      // Convertir el valor de status (string) al enum correspondiente
      const statusValue = parseInt(status);
      try {
        whereClause.status = mapNumberToOrderStatus(statusValue);
      } catch (error) {
        console.error('Invalid status value:', error);
      }
    }

    const orders = await prisma.t_ng_orders.findMany({
      where: whereClause,
      orderBy: [
        { linea_id: 'asc' },
        { sequence_number: 'asc' }
      ],
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener las órdenes' },
      { status: 500 }
    );
  }
}

// POST: Crear una nueva orden
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);
    
    return prisma.$transaction(async (tx) => {
      // 1. Obtener la última posición en la cola para esta línea
      const lastOrder = await tx.t_ng_orders.findFirst({
        where: { 
          linea_id: validatedData.linea_id,
          status: { 
            in: ['WAITING', 'ACTIVE'] as OrderStatus[]
          },
        },
        orderBy: { 
          sequence_number: 'desc' 
        },
      });

      // 2. Calcular la posición para la nueva orden
      const nextPosition = lastOrder ? lastOrder.sequence_number + 1 : 1;
      
      // 3. Determinar el estado según la posición
      // Si es la posición 1 y no hay órdenes activas, estará ACTIVE
      // Si es otra posición o ya hay una activa, estará WAITING
      let status: OrderStatus = 'WAITING';
      
      if (nextPosition === 1) {
        // Verificar si hay alguna orden activa
        const activeOrder = await tx.t_ng_orders.findFirst({
          where: { 
            linea_id: validatedData.linea_id,
            status: 'ACTIVE' as OrderStatus
          },
        });
        
        if (!activeOrder) {
          status = 'ACTIVE' as OrderStatus;
        }
      }
      
      // 5. Crear la orden con la posición adecuada
      const order = await tx.t_ng_orders.create({
        data: {
          job_number: validatedData.job_number,
          product_number: validatedData.product_number,
          quantity_kg: validatedData.quantity_kg,
          consumption_kg_h: validatedData.consumption_kg_h,
          pml_target_g_m: validatedData.pml_target_g_m,
          width_mm: validatedData.width_mm,
          gusset_mm: validatedData.gusset_mm,
          linea_id: validatedData.linea_id,
          sequence_number: nextPosition,
          status: status,
          recipe_uuid: validatedData.recipe_uuid, // Usar recipe_uuid directamente
          is_cancelled: false,
          created_at: new Date()
        }
      });
      
      // 6. Actualizar la versión de la línea
      await lineVersionService.updateLineVersion(tx, validatedData.linea_id);
      
      return NextResponse.json({ success: true, data: order }, { status: 201 });
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear la orden' },
      { status: 500 }
    );
  }
}