"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash, Loader2 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipos
interface Dosifier {
  id: number;
  material: string | null;
  materialId: string | null;
  percentage: number;
}

interface Layer {
  id: string;
  name: string;
  percentage: number;
  dosifiers: Dosifier[];
}

interface RecipeDetails {
  uuid: string;
  name: string;
  layers: Layer[];
}

interface RecipeDetailPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  // Usar React.use() para desenvolver params
  const resolvedParams = use(params);
  const uuid = resolvedParams.uuid;
  
  const router = useRouter();
  
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Cargar datos de la receta
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/recipe/${uuid}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Recipe not found');
          }
          throw new Error('Failed to fetch recipe details');
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [uuid]);

  // Función para eliminar la receta
  const handleDelete = async () => {
    if (!recipe) return;
    
    if (!confirm(`Are you sure you want to delete recipe "${recipe.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/recipe/${uuid}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      router.push('/recipes');
    } catch (err) {
      setError('Error deleting recipe. Please try again.');
      console.error('Error deleting recipe:', err);
    } finally {
      setLoading(false);
    }
  };

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/recipes">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <CardTitle className="text-2xl">{recipe.name}</CardTitle>
                <CardDescription>
                  {recipe.layers.length} layers, 
                  {recipe.layers.reduce((acc, layer) => acc + layer.dosifiers.length, 0)} dosifiers
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href={`/recipes/${uuid}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Edit Recipe
                </Button>
              </Link>
              <Button variant="outline" onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
            </TabsList>
            
            {/* Pestaña de resumen */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recipe Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1">{recipe.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">UUID</dt>
                        <dd className="mt-1 text-sm font-mono">{recipe.uuid}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Total Layers</dt>
                        <dd className="mt-1">{recipe.layers.length}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Layer Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recipe.layers.map(layer => (
                      <div key={layer.id} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{layer.name}</span>
                          <span className="text-sm">{layer.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${layer.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Pestaña de capas */}
            <TabsContent value="layers">
              <div className="space-y-6">
                {recipe.layers.map(layer => (
                  <Card key={layer.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{layer.name} ({layer.id})</CardTitle>
                        <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {layer.percentage}%
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Dosifier</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead>Material ID</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {layer.dosifiers.map(dosifier => (
                            <TableRow key={`${layer.id}-${dosifier.id}`}>
                              <TableCell className="font-medium">
                                {dosifier.id === 0 
                                  ? layer.id 
                                  : `${layer.id}${dosifier.id}`}
                              </TableCell>
                              <TableCell>{dosifier.material || 'N/A'}</TableCell>
                              <TableCell>{dosifier.materialId || 'N/A'}</TableCell>
                              <TableCell className="text-right">{dosifier.percentage}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Pestaña de materiales */}
            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Materials Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Material ID</TableHead>
                        <TableHead>Used In</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Crear lista única de materiales */}
                      {Array.from(new Set(
                        recipe.layers.flatMap(layer => 
                          layer.dosifiers
                            .filter(d => d.material && d.materialId)
                            .map(d => `${d.materialId}|${d.material}`)
                        )
                      )).map(materialKey => {
                        const [materialId, materialName] = materialKey.split('|');
                        
                        // Encontrar en qué dosificadores se usa este material
                        const usages = recipe.layers.flatMap(layer => 
                          layer.dosifiers
                            .filter(d => d.materialId === materialId)
                            .map(d => ({
                              layer: layer.id,
                              dosifier: d.id === 0 ? layer.id : `${layer.id}${d.id}`,
                              percentage: d.percentage
                            }))
                        );
                        
                        return (
                          <TableRow key={materialKey}>
                            <TableCell className="font-medium">{materialName}</TableCell>
                            <TableCell>{materialId}</TableCell>
                            <TableCell>
                              <ul className="list-disc pl-5">
                                {usages.map((usage, idx) => (
                                  <li key={idx}>
                                    Layer {usage.layer}, Dosifier {usage.dosifier} ({usage.percentage}%)
                                  </li>
                                ))}
                              </ul>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}