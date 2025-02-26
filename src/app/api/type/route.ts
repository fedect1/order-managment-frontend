
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from 'next/server';
import { z } from "zod";


const postSchema = z.object({
    RAWTYP_SHORT: z.string().min(1),
    RAWTYP_DESC: z.string().min(2),
}).strict(); 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedBody = postSchema.parse(body);

    const type = await prisma.t_rawtyp.create({
      data: validatedBody,
    });

    const safeType = JSON.parse(
        JSON.stringify(type, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
    );
  
    return NextResponse.json(safeType);
  } catch (error) {
    console.error("[TYPE]: ", error);

    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 422 });
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

