import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Definir el tipo correcto para los parámetros de ruta
type RouteContext = {
  params: Promise<{ materialId: string }>
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const resolvedParams = await params;
        const { materialId } = resolvedParams;

        const materialIdInt = parseInt(materialId, 10);

        const values = await req.json();

        const material = await prisma.t_rawmat.update({
            where: {
                RAWMAT_RAWMAT: materialIdInt
            },
            data: {
                ...values
            },
        });
        
        const safeMaterial = JSON.parse(
            JSON.stringify(material, (_, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
        );
        
        return NextResponse.json(safeMaterial);
    } catch (error) {
        console.log("MATERIAL ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    try {
        const resolvedParams = await params;
        const { materialId } = resolvedParams;
        
        const materialIdInt = parseInt(materialId, 10);

        const material = await prisma.t_rawmat.delete({
            where: {
                RAWMAT_RAWMAT: materialIdInt
            }
        });

        const deletedMaterial = JSON.parse(
            JSON.stringify(material, (_, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
        );

        return NextResponse.json(deletedMaterial, { status: 204 });
    } catch (error) {
        console.log("MATERIAL ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}