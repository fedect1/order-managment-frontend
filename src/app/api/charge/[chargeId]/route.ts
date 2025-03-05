import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Definir el tipo correcto para los parámetros de ruta
type RouteContext = {
  params: Promise<{ chargeId: string }>
};

export async function PATCH(req: NextRequest, { params }: RouteContext) {
    try {
        const resolvedParams = await params;
        const { chargeId } = resolvedParams;

        const chargeIdInt = parseInt(chargeId, 10);

        const values = await req.json();

        const charge = await prisma.t_rawcharge.update({
            where: {
                RAWCHARGE_RAWCHARGE: chargeIdInt
            },
            data: {
                ...values
            },
        });
        
        const safeCharge = JSON.parse(
            JSON.stringify(charge, (_, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
        );
        
        return NextResponse.json(safeCharge);
    } catch (error) {
        console.log("CHARGE ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    try {
        const resolvedParams = await params;
        const { chargeId } = resolvedParams;
        
        const chargeIdInt = parseInt(chargeId, 10);

        const charge = await prisma.t_rawcharge.delete({
            where: {
                RAWCHARGE_RAWCHARGE: chargeIdInt
            }
        });

        const deletedCharge = JSON.parse(
            JSON.stringify(charge, (_, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
        );

        return NextResponse.json(deletedCharge, { status: 204 });
    } catch (error) {
        console.log("CHARGE ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}