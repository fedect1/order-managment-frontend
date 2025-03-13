// src/app/api/recipes/route.ts - versión corregida
import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Obtener parámetros de consulta (para paginación y filtrado)
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Paso 1: Obtener UUIDs únicos de recetas (no eliminadas)
    const uniqueRecipeUuids = await prisma.$queryRaw<{ RECIPE_UUID: string, RECIPE_REZPNR_UNI: string, count: bigint }[]>`
      SELECT DISTINCT r.RECIPE_UUID, r.RECIPE_REZPNR_UNI, COUNT(*) as count
      FROM t_av_recipe r
      WHERE r.RECIPE_DELETE = FALSE
      AND (
        r.RECIPE_REZPNR_UNI LIKE ${`%${search}%`}
      )
      GROUP BY r.RECIPE_UUID, r.RECIPE_REZPNR_UNI
      ORDER BY r.RECIPE_REZPNR_UNI ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Paso 2: Obtener el total para la paginación
    const totalCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(DISTINCT RECIPE_UUID) as count
      FROM t_av_recipe
      WHERE RECIPE_DELETE = FALSE
      AND (
        RECIPE_REZPNR_UNI LIKE ${`%${search}%`}
      )
    `;

    // Mapear los resultados para incluir información adicional y convertir BigInt a Number
    const recipes = uniqueRecipeUuids.map(recipe => ({
      uuid: recipe.RECIPE_UUID,
      name: recipe.RECIPE_REZPNR_UNI,
      componentsCount: Number(recipe.count) // Convertir BigInt a Number
    }));

    // Convertir el conteo total de BigInt a Number
    const totalCountNumber = totalCount.length > 0 ? Number(totalCount[0].count) : 0;

    return NextResponse.json({
      recipes,
      pagination: {
        total: totalCountNumber,
        page,
        limit,
        pages: Math.ceil(totalCountNumber / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}