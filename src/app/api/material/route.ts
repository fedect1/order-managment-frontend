import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from 'next/server';
import { z } from "zod";

const densitySchema = z.preprocess(
  (val) => (typeof val === "string" ? parseFloat(val) : val),
  z.number().gt(0, { message: "Value must be greater than 0" }).lt(1, { message: "Value must be less than 1" })
);

const optionalDensitySchema = z.preprocess(
  (val) => {
    if (val === undefined || val === "") return undefined;
    return typeof val === "string" ? parseFloat(val) : val;
  },
  z.number().gt(0, { message: "If provided, value must be greater than 0" })
    .lt(1, { message: "If provided, value must be less than 1" })
    .optional()
);

const postSchema = z.object({
  // Campos obligatorios
  RAWMAT_NAME: z.string().min(1, { message: "Code is required" }),
  RAWMAT_SHORT: z.string().min(2, { message: "Material name must have at least 2 characters" }),
  RAWMAT_DENSITY: densitySchema,
  RAWMAT_RAWTYP: z.number().min(1, { message: "Type is required" }),
  RAWMAT_COLOR: z.number().min(5, { message: "Color is required" }),
  
  // Campos opcionales
  RAWMAT_MFIVAL: optionalDensitySchema,
  RAWMAT_BULKDENS: optionalDensitySchema,
  RAWMAT_ARTN: z.string().optional(),
}).strict();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const validatedBody = postSchema.parse(body);
    
    // Crear un objeto con valores por defecto para los campos opcionales que son null o undefined
    const dataToCreate = {
      ...validatedBody,
      // Agregar valores por defecto para campos opcionales
      RAWMAT_MFIVAL: validatedBody.RAWMAT_MFIVAL ?? 0,
      RAWMAT_BULKDENS: validatedBody.RAWMAT_BULKDENS ?? 0,
      RAWMAT_ARTN: validatedBody.RAWMAT_ARTN || "",
      // Asegurar que RAWMAT_DELETED comience como false
      RAWMAT_DELETED: false
    };

    const material = await prisma.t_rawmat.create({
      data: dataToCreate,
    });

    // Serializar material para manejar campos BigInt
    const safeMaterial = JSON.parse(
      JSON.stringify(material, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    
    return NextResponse.json(safeMaterial);
  } catch (error) {
    console.error("[MATERIAL]: ", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 422 });
    }
    
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}