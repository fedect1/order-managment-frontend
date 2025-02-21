import prisma from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request) { 
    const orders = await prisma.t_av_order.findMany()

    const ordersSerialized = JSON.parse(
        JSON.stringify(orders, (_, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      )
    

    return NextResponse.json(ordersSerialized)
}