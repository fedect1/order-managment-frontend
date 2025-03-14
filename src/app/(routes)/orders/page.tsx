import { HeaderOrders } from "./components/HeaderOrders"
import prisma from "@/lib/prisma";

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
  const recipesList = await fetchRecipes()
  console.log(recipesList)
  return (
    <div>
        <HeaderOrders lineList={lineList}/>
        <p>List of orders</p>
    </div>
  )
}
