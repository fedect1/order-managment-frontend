import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

interface RecipeParams {
  params: Promise<{
    uuid: string;
  }>;
}

// Interfaz para una entrada de receta en la base de datos
interface RecipeEntry {
  RECIPE_REZPNR_UNI: string;
  RECIPE_SCHICHT: string;
  RECIPE_SCHICHT_ANTEIL: number;
  RECIPE_REZPNR_MAT: string;
  RECIPE_COMPONENT: number;
  RECIPE_MATERIAL: string | null;
  RECIPE_MATERIAL_ID: string | null;
  RECIPE_DICHTE: number | null;
  RECIPE_MATERIAL_ANTEIL: number;
  RECIPE_ROHSTOFF: string | null;
}

// Interfaz para el cuerpo de la solicitud PUT
interface PutRequestBody {
  entries: RecipeEntry[];
}

export async function GET(request: Request, { params }: RecipeParams) {
  try {
    // Resolver la promesa de params
    const resolvedParams = await params;
    const { uuid } = resolvedParams;

    if (!uuid) {
      return NextResponse.json(
        { error: 'Recipe UUID is required' },
        { status: 400 }
      );
    }

    // Obtener todas las filas de la receta
    const recipeEntries = await prisma.t_av_recipe.findMany({
      where: {
        RECIPE_UUID: uuid,
        RECIPE_DELETE: false
      },
      orderBy: [
        { RECIPE_SCHICHT: 'asc' },
        { RECIPE_COMPONENT: 'asc' }
      ]
    });

    if (!recipeEntries.length) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Extraer información básica de la receta
    const recipeName = recipeEntries[0].RECIPE_REZPNR_UNI || 'Unnamed Recipe';

    // Agrupar por capas
    type LayerData = {
      id: string;
      name: string;
      percentage: number;
      dosifiers: {
        id: number;
        material: string | null;
        materialId: string | null;
        percentage: number;
      }[];
    };

    const layers: Record<string, LayerData> = {};

    recipeEntries.forEach(entry => {
      const layerId = entry.RECIPE_SCHICHT || '';
      
      // Si esta capa no existe en nuestro objeto layers, inicializarla
      if (!layers[layerId]) {
        layers[layerId] = {
          id: layerId,
          name: `Layer ${layerId}`,
          percentage: Number(entry.RECIPE_SCHICHT_ANTEIL) || 0,
          dosifiers: []
        };
      }

      // Añadir este dosificador a la capa
      layers[layerId].dosifiers.push({
        id: Number(entry.RECIPE_COMPONENT),
        material: entry.RECIPE_MATERIAL,
        materialId: entry.RECIPE_MATERIAL_ID,
        percentage: Number(entry.RECIPE_MATERIAL_ANTEIL) || 0
      });
    });

    // Convertir a array para facilitar el consumo en el frontend
    const layersArray = Object.values(layers);

    return NextResponse.json({
      uuid,
      name: recipeName,
      layers: layersArray
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe details' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RecipeParams) {
  try {
    // Resolver la promesa de params
    const resolvedParams = await params;
    const { uuid } = resolvedParams;
    const body = await request.json() as PutRequestBody;

    if (!uuid) {
      return NextResponse.json(
        { error: 'Recipe UUID is required' },
        { status: 400 }
      );
    }

    // Verificar que la receta existe
    const existingRecipe = await prisma.t_av_recipe.findFirst({
      where: {
        RECIPE_UUID: uuid,
        RECIPE_DELETE: false
      }
    });

    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Implementar la eliminación lógica de registros existentes
    await prisma.t_av_recipe.updateMany({
      where: {
        RECIPE_UUID: uuid
      },
      data: {
        RECIPE_DELETE: true
      }
    });

    // Crear nuevas entradas con el mismo UUID
    const newEntries = body.entries.map((entry: RecipeEntry) => ({
      ...entry,
      RECIPE_UUID: uuid,
      RECIPE_DELETE: false
    }));

    await prisma.$transaction(
      newEntries.map((entry: RecipeEntry & { RECIPE_UUID: string; RECIPE_DELETE: boolean }) => 
        prisma.t_av_recipe.create({
          data: entry
        })
      )
    );

    return NextResponse.json({
      message: 'Recipe updated successfully',
      uuid
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RecipeParams) {
  try {
    // Resolver la promesa de params
    const resolvedParams = await params;
    const { uuid } = resolvedParams;

    if (!uuid) {
      return NextResponse.json(
        { error: 'Recipe UUID is required' },
        { status: 400 }
      );
    }

    // Marcar todos los registros de esta receta como eliminados (soft delete)
    const updateResult = await prisma.t_av_recipe.updateMany({
      where: {
        RECIPE_UUID: uuid
      },
      data: {
        RECIPE_DELETE: true
      }
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        { error: 'Recipe not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Recipe deleted successfully',
      count: updateResult.count
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}