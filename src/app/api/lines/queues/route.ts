// src/app/api/lines/queues/route.ts
import {  NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// Obtener todas las líneas con sus órdenes en cola
export async function GET() {
  try {
    // 1. Obtener todas las líneas activas
    const lines = await prisma.t_line.findMany({
      select: {
        LINE_ID: true,
        LINE_NAME: true,
      },
      orderBy: {
        LINE_NAME: 'asc'
      }
    });
    
    // 2. Para cada línea, obtener sus órdenes activas y en espera
    const result = await Promise.all(lines.map(async (line) => {
      const orders = await prisma.t_ng_orders.findMany({
        where: { 
          linea_id: line.LINE_ID,
          status: { 
            in: ['WAITING', 'ACTIVE'] as OrderStatus[]
          },
        },
        orderBy: { 
          sequence_number: 'asc' // Ordenar por secuencia
        },
      });
      
      return {
        id: line.LINE_ID,
        name: line.LINE_NAME,
        orders: orders
      };
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: result
    });
  } catch (error) {
    console.error('Error fetching lines with orders:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener colas de líneas' },
      { status: 500 }
    );
  }
}