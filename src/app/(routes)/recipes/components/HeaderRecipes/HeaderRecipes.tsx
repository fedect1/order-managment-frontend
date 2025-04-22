import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeaderRecipes() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">List of Recipes</h2>
      <Link href="/recipes/create-new">
        <Button>Utwórz przepis</Button>
      </Link>
    </div>
  )
}