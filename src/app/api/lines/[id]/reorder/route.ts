import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Estructura correcta para rutas de API en Next.js App Router
export async function POST(
  request: NextRequest, 
  { params }: { params: { id: string } } // Formato correcto para los parámetros
) {
  try {
    const lineId = params.id; // Obtener el ID desde los parámetros
    const body = await request.json();
    
    // Obtener los elementos reordenados del cuerpo
    const { reorderedItems } = body;
    
    if (!reorderedItems || !Array.isArray(reorderedItems)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Actualizar el orden de los elementos
    const updatePromises = reorderedItems.map(async (item, index) => {
      if (item.order_id === -1) return null;
      
      return prisma.t_ng_orders.update({
        where: {
          order_id: item.order_id,
          linea_id: parseInt(lineId) // Asegúrate de que lineId sea del tipo correcto
        },
        data: {
          sequence_number: index + 1
        }
      });
    });
    
    // Esperar a que todas las actualizaciones se completen
    await Promise.all(updatePromises);
    
    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Order sequence updated successfully',
      data: reorderedItems
    });
  } catch (error) {
    console.error('Error updating order sequence:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update order sequence',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}