import { HeaderMaterial } from "./components/HeaderMaterial";
import { HeaderType } from "./components/HeaderType";
import { ListMaterials } from "./components/ListMaterials";
import { ListTypes } from "./components/ListTypes";
import prisma from "@/lib/prisma"; // Assuming you have your Prisma client set up like this

async function fetchRawTypes() {
  const rawTypes = await prisma.t_rawtyp.findMany({
    select: {
      RAWTYP_RAWTYP: true,
      RAWTYP_SHORT: true,
      RAWTYP_DESC: true
    }
  });
  
  return rawTypes;
}

export default async function MaterialsPage() {

  const rawTypes = await fetchRawTypes();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-x-10">
      <div className="lg:col-span-2 pr-2 lg:border-r lg:border-gray-300">
        <HeaderMaterial rawTypes={rawTypes}/>
        <ListMaterials/>
      </div>
      <div className="lg:col-span-1">
        <HeaderType/>
        <ListTypes/>
      </div>
    </div>
  )
}