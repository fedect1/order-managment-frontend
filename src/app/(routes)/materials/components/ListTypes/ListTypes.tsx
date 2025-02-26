import prisma from "@/lib/prisma"
import { DataTable } from "./data-table";
import { columns } from "./columns";

export async function ListTypes() {
    const types = await prisma.t_rawtyp.findMany({
        orderBy: {
            RAWTYP_RAWTYP: "desc"
        }
    });
    return (
      <DataTable columns={columns} data={types}/>
    )
  }
  