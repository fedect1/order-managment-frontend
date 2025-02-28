import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
import { Header } from './Components/Header/Header';
import { MaterialInfo } from "./Components/MaterialInfo";
import { FooterMaterial } from "./Components/FooterMaterial";

export default async function ChargeIdPage({ params }: { params: { chargeId: string } | Promise<{ chargeId: string }> }) {
    const { chargeId } = await params;

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
  