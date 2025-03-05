import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";

// Define un tipo más específico para searchParams
type SearchParams = {
  [key: string]: string | string[] | undefined
};

type PageProps = {
  params?: Promise<{ chargeId: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function ChargeIdPage({ params }: PageProps) {
    // Si params es undefined, usamos un objeto vacío
    const resolvedParams = await (params || Promise.resolve({ chargeId: "" }));
    const { chargeId } = resolvedParams;

    if (!chargeId) {
        return redirect("/materials");
    }

    const chargeIdInt = parseInt(chargeId, 10)

    const charge = await prisma.t_rawcharge.findUnique({
        where: {
            RAWCHARGE_RAWCHARGE: chargeIdInt
        }
    })

    if (!charge) {
        return redirect("/materials")
    }
    
    console.log(charge)
    
    return (
      <div>
        <p>{chargeId}</p>
        {/* <Header/>
        <MaterialInfo material={material}/>
        <FooterMaterial materialId={materialIdInt}/> */}
      </div>
    );
}