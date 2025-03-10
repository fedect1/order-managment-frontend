import prisma from "@/lib/prisma"
import { DataTable } from "./data-table";
import { columns } from "./columns";

export async function ListMaterials() {
    const materials = await prisma.t_rawmat.findMany({
        where: {
          RAWMAT_DELETED: false
        },
        orderBy: {
          RAWMAT_RAWMAT: "desc"
        }
    });
    // console.log(materials)
    return (
      <DataTable columns={columns} data={materials}/>
    )
  }
  