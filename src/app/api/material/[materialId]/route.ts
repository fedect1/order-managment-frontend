import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { materialId: string } | Promise<{ materialId: string }> }) {
    try {
        console.log("Entra")
        const { materialId } = await params;

        const materialIdInt = parseInt(materialId, 10)

        const values = await req.json()

        const material = await prisma.t_rawmat.update({
            where: {
                RAWMAT_RAWMAT: materialIdInt
            },
            data: {
                ...values
            },
        })
        const safeMaterial = JSON.parse(
            JSON.stringify(material, (_, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
        );
        return NextResponse.json(safeMaterial)

    } catch (error) {
        console.log("MATERIAL ID", error)
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