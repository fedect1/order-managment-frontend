import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { TypeInfo } from "./components/TypeInfo";

export default async function TypeIdPage({ params }: { params: {typeId: string } | Promise<{ typeId: string }> }) {
    const { typeId } = await params;

    const typeInt = parseInt(typeId, 10)

    const type = await prisma.t_rawtyp.findUnique({
        where: {
            RAWTYP_RAWTYP: typeInt
        }
    })

    if (!type) {
        return redirect("/materials")
    }
    return (
      <div>
        <Header/>
        <TypeInfo type={ type }/>
      </div>
    );
  }