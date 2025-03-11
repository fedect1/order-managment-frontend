import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from 'next/server';
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

// Schema para validar los valores de porcentaje (2 decimales)
const percentageSchema = z.preprocess(
  (val) => (typeof val === "string" ? parseFloat(val) : val),
  z.number()
    .min(0, { message: "Percentage must be at least 0" })
    .max(100, { message: "Percentage cannot exceed 100" })
);

// Schema para una entrada de receta individual
const recipeEntrySchema = z.object({
  RECIPE_REZPNR_UNI: z.string().max(20, { message: "Recipe name cannot exceed 20 characters" }),
  RECIPE_SCHICHT: z.string().max(4, { message: "Layer ID cannot exceed 4 characters" }),
  RECIPE_SCHICHT_ANTEIL: percentageSchema,
  RECIPE_REZPNR_MAT: z.string().max(20, { message: "Recipe material name cannot exceed 20 characters" }),
  RECIPE_COMPONENT: z.number().int().min(0, { message: "Component ID must be a non-negative integer" }),
  RECIPE_MATERIAL: z.string().max(25, { message: "Material name cannot exceed 25 characters" }).nullable(),
  RECIPE_MATERIAL_ID: z.string().max(10, { message: "Material ID cannot exceed 10 characters" }).nullable(),
  RECIPE_DICHTE: z.number().nullable(),
  RECIPE_MATERIAL_ANTEIL: percentageSchema,
  RECIPE_ROHSTOFF: z.string().nullable()
});

// Schema para el cuerpo completo de la solicitud (array de entradas de receta)
const postSchema = z.array(recipeEntrySchema);

export async function POST(req: NextRequest) {
  try {
    // Intentar leer el body de la solicitud
    const body = await req.json();
    
    if (!body || body.length === 0) {
      return NextResponse.json({ error: "Request body is empty or invalid" }, { status: 400 });
    }
    
    // Validar el cuerpo de la solicitud contra el schema
    const validatedEntries = postSchema.parse(body);
    
    // Generar un UUID único para esta receta
    const recipeUuid = uuidv4();
    
    // Procesar cada entrada de receta y crear registros en la base de datos
    const createdEntries = await prisma.$transaction(
      validatedEntries.map(entry => {
        // Aquí está el cambio clave: omitimos RECIPE_UUID del objeto dataToCreate
        // y lo incluimos por separado en la llamada a create()
        return prisma.t_av_recipe.create({
          data: {
            // Campos de entrada validados
            RECIPE_REZPNR_UNI: entry.RECIPE_REZPNR_UNI,
            RECIPE_SCHICHT: entry.RECIPE_SCHICHT,
            RECIPE_SCHICHT_ANTEIL: entry.RECIPE_SCHICHT_ANTEIL,
            RECIPE_REZPNR_MAT: entry.RECIPE_REZPNR_MAT,
            RECIPE_COMPONENT: entry.RECIPE_COMPONENT,
            RECIPE_MATERIAL: entry.RECIPE_MATERIAL || null,
            RECIPE_MATERIAL_ID: entry.RECIPE_MATERIAL_ID || null,
            RECIPE_DICHTE: entry.RECIPE_DICHTE || null,
            RECIPE_MATERIAL_ANTEIL: entry.RECIPE_MATERIAL_ANTEIL,
            RECIPE_ROHSTOFF: entry.RECIPE_ROHSTOFF || null,
            // Agregar el campo UUID correctamente
            RECIPE_UUID: recipeUuid,
            RECIPE_DELETE: false,
          }
        });
      })
    );

    // Serializar las entradas creadas para manejar campos BigInt u otros tipos especiales
    const safeEntries = JSON.parse(
      JSON.stringify(createdEntries, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    
    return NextResponse.json({ 
      message: `Successfully created ${safeEntries.length} recipe entries`,
      recipeUuid, // Devolver el UUID generado
      data: safeEntries 
    });
  } catch (error) {
    // Mejorar el manejo de errores para evitar problemas de serialización
    console.log("[RECIPE ERROR]:");
    
    if (error instanceof Error) {
      console.log(`- Type: ${error.name}`);
      console.log(`- Message: ${error.message}`);
      console.log(`- Stack: ${error.stack?.substring(0, 200)}...`);
    } else {
      console.log("- Unknown error type", typeof error);
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 422 });
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}