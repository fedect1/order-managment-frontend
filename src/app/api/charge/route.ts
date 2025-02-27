
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from 'next/server';
import { z } from "zod";


const postSchema = z.object({
    RAWCHARGE_RAWMAT: z.number(),
    RAWCHARGE_CHARGENR: z.string().min(2),
    RAWCHARGE_AMOUNT: z.number().min(1),
    RAWCHARGE_ACTAMOUNT: z.number().min(1),
    RAWCHARGE_STATE: z.number().min(1),
}).strict(); 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedBody = postSchema.parse(body);

    const charge = await prisma.t_rawcharge.create({
      data: {
        ...validatedBody,
        RAWCHARGE_DATIM: new Date(),
        RAWCHARGE_ATTRIBUTE: 0,
      }
    });

    const safeCharge = JSON.parse(
        JSON.stringify(charge, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
    );
  
    return NextResponse.json(safeCharge);
  } catch (error) {
    console.error("[CHARGE]: ", error);

    if (error instanceof z.ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 422 });
    }

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

