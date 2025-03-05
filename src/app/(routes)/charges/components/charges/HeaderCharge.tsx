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
  
  // Serializar bigint para evitar problemas de tipo
  const serializedMaterials = materials.map(material => ({
    ...material,
    RAWMAT_COLOR: Number(material.RAWMAT_COLOR) // Convertir bigint a number si es posible
    // Si RAWMAT_COLOR es demasiado grande para Number, usa esto en su lugar:
    // RAWMAT_COLOR: material.RAWMAT_COLOR.toString()
  }));
  
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">List of Charges</h2>
      <DialogCharge materials={serializedMaterials}/>
    </div>
  )
}