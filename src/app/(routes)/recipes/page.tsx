"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Edit, Trash, Plus, Eye } from "lucide-react";

// Tipos
interface Recipe {
  uuid: string;
  name: string;
  componentsCount: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function RecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar las recetas
  const loadRecipes = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/recipes?page=${page}&limit=${pagination.limit}&search=${encodeURIComponent(search)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes);
      setPagination(data.pagination);
    } catch (err) {
      setError('Error loading recipes. Please try again.');
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar recetas al inicio y cuando cambian los parámetros
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    
    setSearchTerm(search);
    loadRecipes(page, search);
  }, [searchParams]);

  // Función para manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Actualizar la URL con parámetros de búsqueda
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    params.set('page', '1'); // Reset to page 1 on new search
    
    router.push(`/recipes?${params.toString()}`);
  };

  // Función para cambiar de página
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/recipes?${params.toString()}`);
  };

  // Función para eliminar una receta
  const deleteRecipe = async (uuid: string, recipeName: string) => {
    if (!confirm(`Are you sure you want to delete recipe "${recipeName}"?`)) {
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

      // Recargar la lista después de eliminar
      await loadRecipes(pagination.page, searchTerm);
      
      alert('Recipe deleted successfully');
    } catch (err) {
      setError('Error deleting recipe. Please try again.');
      console.error('Error deleting recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar paginación
  const renderPagination = () => {
    const { page, pages } = pagination;
    
    if (pages <= 1) return null;
    
    return (
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => changePage(page - 1)} />
            </PaginationItem>
          )}
          
          {Array.from({ length: Math.min(5, pages) }, (_, i) => {
            // Determinar qué páginas mostrar (centradas alrededor de la página actual)
            let pageToShow;
            
            if (pages <= 5) {
              pageToShow = i + 1;
            } else if (page <= 3) {
              pageToShow = i + 1;
            } else if (page >= pages - 2) {
              pageToShow = pages - 4 + i;
            } else {
              pageToShow = page - 2 + i;
            }
            
            return (
              <PaginationItem key={pageToShow}>
                <PaginationLink
                  href="#"
                  onClick={() => changePage(pageToShow)}
                  isActive={pageToShow === page}
                >
                  {pageToShow}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {page < pages && (
            <PaginationItem>
              <PaginationNext href="#" onClick={() => changePage(page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Recipes</CardTitle>
          <Link href="/recipes/create-new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Recipe
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search recipes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}

          {/* Estado de carga */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Tabla de recetas */}
              {recipes.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Components</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recipes.map((recipe) => (
                        <TableRow key={recipe.uuid}>
                          <TableCell className="font-medium">{recipe.name}</TableCell>
                          <TableCell>{recipe.componentsCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {/* Ver detalles */}
                              <Link href={`/recipes/${recipe.uuid}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              
                              {/* Editar */}
                              <Link href={`/recipes/${recipe.uuid}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              
                              {/* Eliminar */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteRecipe(recipe.uuid, recipe.name)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recipes found. {searchTerm && 'Try a different search term or '} 
                  <Link href="/recipes/create-new" className="text-blue-500 hover:underline">
                    create a new recipe
                  </Link>.
                </div>
              )}

              {/* Paginación */}
              <div className="mt-4">
                {renderPagination()}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}