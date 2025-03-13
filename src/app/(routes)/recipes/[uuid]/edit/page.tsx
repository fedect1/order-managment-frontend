"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { EditRecipeForm } from "./EditRecipeForm"; // Importar el nuevo componente de edición

// Interfaces
interface Material {
  RAWMAT_RAWMAT: number;
  RAWMAT_SHORT: string;
}

interface Dosifier {
  id: number;
  materialId: number | null;
  material: string | null;
  percentage: number;
}

interface Layer {
  id: string;
  name: string;
  percentage: number;
  dosifiers: Dosifier[];
}

interface RecipeData {
  uuid: string;
  name: string;
  layers: Layer[];
}

interface EditRecipePageProps {
  params: Promise<{
    uuid: string;
  }>;
}

interface MaterialsApiResponse {
  materials: Material[];
  error?: string;
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  // Usar React.use() para desenvolver params
  const resolvedParams = use(params);
  const uuid = resolvedParams.uuid;
  
  const router = useRouter();
  
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la receta y materiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar la receta
        const recipeResponse = await fetch(`/api/recipe/${uuid}`);
        
        if (!recipeResponse.ok) {
          if (recipeResponse.status === 404) {
            throw new Error('Recipe not found');
          }
          throw new Error('Failed to fetch recipe details');
        }

        const recipeData = await recipeResponse.json() as RecipeData;
        setRecipe(recipeData);

        // Cargar materiales (necesarios para el formulario)
        try {
          const materialsResponse = await fetch('/api/materials');
          
          if (!materialsResponse.ok) {
            console.error('Failed to fetch materials, status:', materialsResponse.status);
            // No lanzar error, solo log y continuar con una lista vacía
          } else {
            const materialsData = await materialsResponse.json() as MaterialsApiResponse;
            if (materialsData.materials && Array.isArray(materialsData.materials)) {
              setMaterials(materialsData.materials);
            } else {
              console.warn('Materials API returned unexpected format:', materialsData);
              setMaterials([]);
            }
          }
        } catch (materialsError) {
          console.error('Error fetching materials:', materialsError);
          // Continuar con una lista vacía de materiales
          setMaterials([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  // Renderizar el estado de carga
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-red-100 text-red-800 rounded-md mb-4">
              {error}
            </div>
            <Button asChild>
              <Link href="/recipes">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar mensaje si no se encontró la receta
  if (!recipe) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              Recipe not found.
            </div>
            <Button asChild>
              <Link href="/recipes">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center">
          <Link href={`/recipes/${uuid}`} className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-2xl">Edit Recipe: {recipe.name}</CardTitle>
        </CardHeader>
      </Card>

      {/* Formulario de edición (usando el nuevo componente) */}
      <EditRecipeForm 
        materials={materials} 
        recipe={recipe}
        recipeUuid={uuid}
        onSaveSuccess={() => {
          router.push(`/recipes/${uuid}`);
        }}
      />
    </div>
  );
}