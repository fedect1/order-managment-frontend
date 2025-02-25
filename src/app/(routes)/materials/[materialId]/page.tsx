import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
import { Header } from './Components/Header/Header';
import { MaterialInfo } from "./Components/MaterialInfo";

export default async function MaterialIdPage({ params }: { params: { materialId: string } | Promise<{ materialId: string }> }) {
    const { materialId } = await params;

    const materialIdInt = parseInt(materialId, 10)

    const material = await prisma.t_rawmat.findUnique({
        where: {
            RAWMAT_RAWMAT: materialIdInt
        }
    })

    if (!material) {
        return redirect("/materials")
    }

    return (
      <div>
        <Header/>
        <MaterialInfo material={material}/>
      </div>
    );
  }
  