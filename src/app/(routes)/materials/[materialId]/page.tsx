import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
import { Header } from './Components/Header/Header';
import { MaterialInfo } from "./Components/MaterialInfo";
import { FooterMaterial } from "./Components/FooterMaterial";

// Define tipos específicos para los parámetros
type SearchParams = {
  [key: string]: string | string[] | undefined
};

type PageProps = {
  params?: Promise<{ materialId: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function MaterialIdPage({ params }: PageProps) {
    // Manejo seguro de params que podrían ser undefined
    const resolvedParams = await (params || Promise.resolve({ materialId: "" }));
    const { materialId } = resolvedParams;

    if (!materialId) {
        return redirect("/materials");
    }

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
        <FooterMaterial materialId={materialIdInt}/>
      </div>
    );
}