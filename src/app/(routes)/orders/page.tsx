import { HeaderOrders } from "./components/HeaderOrders"
import prisma from "@/lib/prisma";

async function fetchLines() {
  const lineList = await prisma.t_line.findMany({
    select: {
      LINE_ID: true,
      LINE_COLOUR: true,
      LINE_NAME: true
    }
  });
  
  return lineList;
}

export default async function OrdersPage() {
  const lineList = await fetchLines()
  return (
    <div>
        <HeaderOrders lineList={lineList}/>
        <p>List of orders</p>
    </div>
  )
}
