// src/app/api/lines/[id]/reorder/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Definir el tipo correcto para los parámetros de ruta
type RouteContext = {
  params: Promise<{ id: string }>
};

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const lineId = id; // No necesitas parseInt si lo vas a usar como string
    const body = await req.json();
    
    const { reorderedItems } = body;
    
    if (!reorderedItems || !Array.isArray(reorderedItems)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    const updatePromises = reorderedItems.map(async (item, index) => {
      if (item.order_id === -1) return null;
      
      return prisma.t_ng_orders.update({
        where: {
          order_id: item.order_id,
          linea_id: parseInt(lineId) // Aquí sí necesitas parseInt
        },
        data: {
          sequence_number: index + 1
        }
      });
    });
    
    await Promise.all(updatePromises);
    
    // Convertir cualquier BigInt a String para evitar problemas de serialización
    const safeData = JSON.parse(
      JSON.stringify(reorderedItems, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    
    return NextResponse.json({
      success: true,
      message: 'Order sequence updated successfully',
      data: safeData
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