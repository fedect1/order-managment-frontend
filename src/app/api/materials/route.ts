import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

// Interfaz para material
interface Material {
  RAWMAT_RAWMAT: number;
  RAWMAT_SHORT: string;
  RAWMAT_NAME: string;
  // Otros campos opcionales
  [key: string]: any;
}

export async function GET(request: Request) {
  try {
    // Obtener parámetros de consulta (para filtrado)
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    // Buscar materiales que no estén eliminados
    const materials = await prisma.t_rawmat.findMany({
      where: {
        RAWMAT_DELETED: false,
        OR: [
          { RAWMAT_SHORT: { contains: search } },
          { RAWMAT_NAME: { contains: search } }
        ]
      },
      orderBy: {
        RAWMAT_SHORT: 'asc'
      }
    });

    // Serializar para manejar valores BigInt
    const safeMaterials = JSON.parse(
      JSON.stringify(materials, (_, value) => 
        typeof value === 'bigint' ? Number(value) : value
      )
    );

    return NextResponse.json({
      materials: safeMaterials
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}