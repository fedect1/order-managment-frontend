import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server' // Eliminamos NextRequest

export async function GET() { // Eliminamos el parámetro request
    const orders = await prisma.t_av_order.findMany()

    const ordersSerialized = JSON.parse(
        JSON.stringify(orders, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
    )
    
    return NextResponse.json(ordersSerialized)
}