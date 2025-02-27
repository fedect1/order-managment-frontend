import prisma from "@/lib/prisma"
import { DataTable } from "./data-table";
import { columns } from "./columns";

export async function ListCharges() {
    const charges = await prisma.t_rawcharge.findMany({
        orderBy: {
          RAWCHARGE_RAWCHARGE: "asc"
        }
    });
    // console.log(materials)
    return (
      <DataTable columns={columns} data={charges}/>
    )
  }
  