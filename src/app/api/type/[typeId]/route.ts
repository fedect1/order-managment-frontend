import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { typeId: string } | Promise<{ typeId: string }> }) {
    try {
        const { typeId } = await params;

        const typeIdInt = parseInt(typeId, 10)

        const values = await req.json()

        const type = await prisma.t_rawtyp.update({
            where: {
                RAWTYP_RAWTYP: typeIdInt
            },
            data: {
                ...values
            },
        })
        return NextResponse.json(type)

    } catch (error) {
        console.log("TYPE ID", error)
        return new NextResponse("Internal Error", { status: 500 })
    }}

    export async function DELETE(req: NextRequest, { params }: { params: { typeId: string } | Promise<{ typeId: string }> }) {
        try {
            const { typeId } = await params;
            
            const typeIdInt = parseInt(typeId, 10)

            const material = await prisma.t_rawtyp.delete({
                where: {
                    RAWTYP_RAWTYP: typeIdInt
                }
            })

            return NextResponse.json(material, { status: 204 })
        } catch (error) {
            console.log("TYPE ID", error)
            return new NextResponse("Internal Error", { status: 500 })
        }
    }