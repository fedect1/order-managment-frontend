import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { TypeInfo } from "./components/TypeInfo";

// Define tipos específicos para los parámetros
type SearchParams = {
  [key: string]: string | string[] | undefined
};

type PageProps = {
  params?: Promise<{ typeId: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function TypeIdPage({ params }: PageProps) {
    // Manejo seguro de params que podrían ser undefined
    const resolvedParams = await (params || Promise.resolve({ typeId: "" }));
    const { typeId } = resolvedParams;

    if (!typeId) {
        return redirect("/materials");
    }

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
        <TypeInfo type={type}/>
      </div>
    );
}