
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from 'next/server';
import { z } from "zod";

const densitySchema = z.preprocess(
  (val) => (typeof val === "string" ? parseFloat(val) : val),
  z.number().gt(0, { message: "Value must be greater than 0" }).lt(1, { message: "Value must be less than 1" })
);

const postSchema = z.object({
  RAWMAT_NAME: z.string(),
  RAWMAT_SHORT: z.string().min(2),
  RAWMAT_DENSITY: densitySchema,
  RAWMAT_MFIVAL: densitySchema,
  RAWMAT_BULKDENS: densitySchema,
  RAWMAT_RAWTYP: z.number().min(1),
  RAWMAT_ARTN: z.string().min(6),
  RAWMAT_COLOR: z.number().min(5),
}).strict(); 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedBody = postSchema.parse(body);

    const material = await prisma.t_rawmat.create({
      data: validatedBody,
    });

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

