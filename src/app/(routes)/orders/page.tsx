import { HeaderOrders } from "./components/HeaderOrders"
import prisma from "@/lib/prisma";
import { CardOrderLine } from "./components/CardOrderLine";

async function fetchLines() {
  const lineList = await prisma.t_line.findMany({
    select: {
      LINE_ID: true,
      LINE_COLOUR: true,
      LINE_NAME: true
    }
  });
  
  return lineList;
}
async function fetchRecipes() {
  // Obtener todas las recetas
  const recipes = await prisma.t_av_recipe.findMany({
    select: {
      RECIPE_UUID: true,  
      RECIPE_REZPNR_UNI: true
    }
  });

  const uniqueRecipesMap = new Map();
  
  recipes.forEach(recipe => {
    if (!uniqueRecipesMap.has(recipe.RECIPE_REZPNR_UNI)) {
      uniqueRecipesMap.set(recipe.RECIPE_REZPNR_UNI, recipe);
    }
  });
  
  const uniqueRecipes = Array.from(uniqueRecipesMap.values());
  
  return uniqueRecipes;
}

export default async function OrdersPage() {
  const lineList = await fetchLines()
  const recipeList = await fetchRecipes()
  return (
    <div>
        <div>
          <HeaderOrders lineList={ lineList } recipeList={ recipeList }/>
          <p>Lista zamówień</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
          {
            lineList.map((line)=>(
              <CardOrderLine key={line.LINE_ID} line={line.LINE_NAME} color={line.LINE_COLOUR} id={line.LINE_ID}/>
            ))
          }
        </div>
    </div>
  )
}
