import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { chargeId: string } | Promise<{ chargeId: string }> }) {
    try {
        const { chargeId } = await params;

        const chargeIdInt = parseInt(chargeId, 10)

        const values = await req.json()

        const charge = await prisma.t_rawcharge.update({
            where: {
                RAWCHARGE_RAWCHARGE: chargeIdInt
            },
            data: {
                ...values
            },
        })
        const safeCharge = JSON.parse(
            JSON.stringify(charge, (_, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
        );
        return NextResponse.json(safeCharge)

    } catch (error) {
        console.log("CHARGE ID", error)
        return new NextResponse("Internal Error", { status: 500 })
    }}

    export async function DELETE(req: NextRequest, { params }: { params: { materialId: string } | Promise<{ materialId: string }> }) {
        try {
            const { materialId } = await params;
            
            const materialIdInt = parseInt(materialId, 10)

            const material = await prisma.t_rawmat.delete({
                where: {
                    RAWMAT_RAWMAT: materialIdInt
                }
            })

            const deletedMaterial = JSON.parse(
                JSON.stringify(material, (_, value) =>
                  typeof value === "bigint" ? value.toString() : value
                )
            );

            return NextResponse.json(deletedMaterial, { status: 204 })
        } catch (error) {
            console.log("MATERIAL ID", error)
            return new NextResponse("Internal Error", { status: 500 })
        }
    }