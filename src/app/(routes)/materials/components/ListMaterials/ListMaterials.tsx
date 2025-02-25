import prisma from "@/lib/prisma"
import { DataTable } from "./data-table";
import { columns } from "./columns";

export async function ListMaterials() {
    const materials = await prisma.t_rawmat.findMany({
        orderBy: {
          RAWMAT_RAWMAT: "asc"
        }
    });
    // console.log(materials)
    return (
      <DataTable columns={columns} data={materials}/>
    )
  }
  