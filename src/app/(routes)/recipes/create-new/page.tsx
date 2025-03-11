import prisma from "@/lib/prisma";
import { FormCreateRecipe } from "./components/FormCreateRecipe";

async function fetchLines() {
  const lines = await prisma.t_line.findMany({
    select: {
      LINE_ID: true,
      LINE_LINE: true,
      LINE_NAME: true,
      LINE_SHORT: true,
      LINE_NDOS: true,
      LINE_NEXT: true
    }
  });
  return lines;
}

export default async function RecipesPage() {
  const lines = await fetchLines()
  console.log(lines)
  return (
    <div>
        <FormCreateRecipe lines={ lines }/>
    </div>
  )
}
