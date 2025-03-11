import prisma from "@/lib/prisma";
import { FormCreateRecipe } from "./components/FormCreateRecipe";

async function fetchMaterials() {
  const materials = await prisma.t_rawmat.findMany({
    select: {
      RAWMAT_RAWMAT: true,
      RAWMAT_SHORT: true,
      RAWMAT_COLOR: true,
      RAWMAT_DENSITY: true
    }
  });
  return materials;
}

export default async function RecipesPage() {
  const materials = await fetchMaterials()
  console.log(materials)
  return (
    <div>
        <FormCreateRecipe materials={ materials }/>
    </div>
  )
}
