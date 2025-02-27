
import prisma from "@/lib/prisma";
import { DialogCharge } from "./DialogCharge/DialogCharge"

export async function HeaderCharge() {
  const materials = await prisma.t_rawmat.findMany({
    orderBy: {
      RAWMAT_RAWMAT: "desc"
    },
    select: {
      RAWMAT_RAWMAT: true,
      RAWMAT_NAME: true,
      RAWMAT_COLOR: true,
      RAWMAT_DENSITY: true,
    },
  });
  // console.log(materials)
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">List of Charges</h2>
      <DialogCharge materials= { materials }/>
    </div>
  )
}
