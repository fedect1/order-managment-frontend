import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Definir el tipo correcto para los parámetros de ruta
type RouteContext = {
  params: Promise<{ typeId: string }>
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const resolvedParams = await params;
        const { typeId } = resolvedParams;

        const typeIdInt = parseInt(typeId, 10);

        const values = await req.json();

        const type = await prisma.t_rawtyp.update({
            where: {
                RAWTYP_RAWTYP: typeIdInt
            },
            data: {
                ...values
            },
        });
        
        return NextResponse.json(type);
    } catch (error) {
        console.log("TYPE ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    try {
        const resolvedParams = await params;
        const { typeId } = resolvedParams;
        
        const typeIdInt = parseInt(typeId, 10);

        const type = await prisma.t_rawtyp.delete({
            where: {
                RAWTYP_RAWTYP: typeIdInt
            }
        });

        return NextResponse.json(type, { status: 204 });
    } catch (error) {
        console.log("TYPE ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}