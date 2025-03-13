"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormLabel, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Minus, Loader2 } from "lucide-react";

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

interface RecipeEntry {
  RECIPE_REZPNR_UNI: string;
  RECIPE_SCHICHT: string;
  RECIPE_SCHICHT_ANTEIL: number;
  RECIPE_REZPNR_MAT: string;
  RECIPE_COMPONENT: number;
  RECIPE_MATERIAL: string | null;
  RECIPE_MATERIAL_ID: string | null;
  RECIPE_DICHTE: number | null;
  RECIPE_MATERIAL_ANTEIL: number;
  RECIPE_ROHSTOFF: string | null;
}

interface EditRecipeFormProps {
  materials: Material[];
  recipe: RecipeData;
  recipeUuid: string;
  onSaveSuccess?: () => void;
}

// Función para redondear a 2 decimales
const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

// Esquema de validación Zod
const percentageSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  },
  z.number()
    .min(0, { message: "Percentage must be at least 0" })
    .max(100, { message: "Percentage cannot exceed 100" })
);

const layerSchema = z.object({
  id: z.string(),
  name: z.string(),
  percentage: percentageSchema,
  dosifiers: z.array(
    z.object({
      id: z.number(),
      materialId: z.number().nullable(),
      material: z.string().nullable(),
      percentage: percentageSchema,
    })
  ),
});

const formSchema = z.object({
  recipeName: z.string()
    .min(1, { message: "Recipe name is required" })
    .max(20, { message: "Recipe name cannot exceed 20 characters" }),
  layers: z.array(layerSchema),
  totalLayers: z.number().min(1).max(9)
});

export function EditRecipeForm({ materials, recipe, recipeUuid, onSaveSuccess }: EditRecipeFormProps) {
  const [numLayers, setNumLayers] = useState(recipe.layers.length);
  const [layers, setLayers] = useState<Layer[]>(recipe.layers);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipeName: recipe.name,
      layers: recipe.layers,
      totalLayers: recipe.layers.length
    },
    mode: "onChange",
  });

  // Inicializar las capas cuando cambia el número de capas
  useEffect(() => {
    setLayers(prevLayers => {
      const newLayers: Layer[] = [];
      
      for (let i = 0; i < numLayers; i++) {
        const layerLetter = String.fromCharCode(65 + i); // A, B, C, ...
        
        // Verificar si esta capa ya existe para mantener sus datos
        const existingLayer = prevLayers.find((l: Layer) => l.id === layerLetter);
        
        if (existingLayer) {
          newLayers.push(existingLayer);
        } else {
          // Crear el primer dosificador que es el principal (A, B, C)
          newLayers.push({
            id: layerLetter,
            name: `Layer ${layerLetter}`,
            percentage: 100, // Por defecto, si es la única capa
            dosifiers: [
              { id: 0, materialId: null, material: null, percentage: 100 }
            ]
          });
        }
      }
      
      // Ajustar los porcentajes para que la suma sea 100%
      const totalLayers = newLayers.length;
      if (totalLayers > 0) {
        const percentagePerLayer = roundToTwoDecimals(100 / totalLayers);
        
        // Aseguramos que el total sea exactamente 100%
        let remaining = 100;
        
        newLayers.forEach((layer, index) => {
          if (index === newLayers.length - 1) {
            // La última capa recibe el resto para asegurar que sume exactamente 100%
            layer.percentage = roundToTwoDecimals(remaining);
          } else {
            layer.percentage = percentagePerLayer;
            remaining -= percentagePerLayer;
          }
        });
      }
      
      return newLayers;
    });

    // Actualizar valores del formulario
    form.setValue('totalLayers', numLayers);
  }, [numLayers, form]);

  // Efecto para sincronizar las capas con el formulario
  useEffect(() => {
    form.setValue('layers', layers);
  }, [layers, form]);

  // Función para validar que la suma de porcentajes de capa sea 100%
  const validateLayerPercentages = () => {
    const totalSum = layers.reduce((total, layer) => total + layer.percentage, 0);
    if (Math.round(totalSum) !== 100) {
      setError(`The sum of layer percentages must be 100%. Currently: ${roundToTwoDecimals(totalSum)}%`);
      return false;
    }
    setError(null);
    return true;
  };

  // Función para validar que la suma de porcentajes de dosificadores en una capa sea 100%
  const validateDosifierPercentages = (layerId: string) => {
    const layer = layers.find((l: Layer) => l.id === layerId);
    if (layer) {
      const totalSum = layer.dosifiers.reduce((total, dos) => total + dos.percentage, 0);
      if (Math.round(totalSum) > 100) {
        setError(`The sum of dosifier percentages in Layer ${layerId} cannot exceed 100%. Currently: ${roundToTwoDecimals(totalSum)}%`);
        return false;
      }
      if (Math.round(totalSum) < 100) {
        setError(`The sum of dosifier percentages in Layer ${layerId} must be 100%. Currently: ${roundToTwoDecimals(totalSum)}%`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Función para actualizar el porcentaje de una capa
  const updateLayerPercentage = (layerId: string, newPercentage: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex((l: Layer) => l.id === layerId);
      
      if (layerIndex !== -1) {
        newLayers[layerIndex].percentage = newPercentage;
      }
      
      return newLayers;
    });
  };

  // Función para agregar un dosificador a una capa
  const addDosifier = (layerId: string) => {
    setLayers(prevLayers => {
      // Verificar si ya existe un dosificador con el ID esperado para evitar duplicación
      const layer = prevLayers.find((l: Layer) => l.id === layerId);
      if (!layer) return prevLayers;
      
      const newId = layer.dosifiers.length;
      
      // Verificar si ya existe un dosificador con este ID
      if (layer.dosifiers.some(d => d.id === newId)) {
        // Si ya existe, no hagas nada
        return prevLayers;
      }
      
      // Hacer una copia profunda para evitar modificaciones inesperadas
      const newLayers = JSON.parse(JSON.stringify(prevLayers));
      const layerIndex = newLayers.findIndex((l: Layer) => l.id === layerId);
      
      if (layerIndex !== -1 && newId < 9) {
        // Continuar con la adición del dosificador
        const layer = newLayers[layerIndex];
        
        // Agregar un nuevo dosificador
        layer.dosifiers.push({
          id: newId,
          materialId: null,
          material: null,
          percentage: 0
        });
        
        // Redistribuir porcentajes
        const mainDosifierPercentage = layer.dosifiers[0].percentage;
        const remainingPercentage = 100 - mainDosifierPercentage;
        const additionalDosifiersCount = layer.dosifiers.length - 1;
        
        if (additionalDosifiersCount > 0) {
          const percentagePerAdditionalDosifier = roundToTwoDecimals(remainingPercentage / additionalDosifiersCount);
          
          // Asegurar que la suma sea exactamente el porcentaje restante
          let remaining = remainingPercentage;
          
          for (let i = 1; i < layer.dosifiers.length; i++) {
            if (i === layer.dosifiers.length - 1) {
              // El último dosificador adicional recibe el resto
              layer.dosifiers[i].percentage = roundToTwoDecimals(remaining);
            } else {
              layer.dosifiers[i].percentage = percentagePerAdditionalDosifier;
              remaining -= percentagePerAdditionalDosifier;
            }
          }
        }
      }
      
      return newLayers;
    });
  };

  // Función para eliminar un dosificador de una capa
  const removeDosifier = (layerId: string, dosifierId: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex((l: Layer) => l.id === layerId);
      
      if (layerIndex !== -1) {
        const layer = newLayers[layerIndex];
        
        // Solo se pueden eliminar dosificadores con id > 0 (no el principal)
        if (dosifierId > 0) {
          // Obtener el porcentaje del dosificador a eliminar
          const dosifierToRemove = layer.dosifiers.find(d => d.id === dosifierId);
          const percentageToRedistribute = dosifierToRemove?.percentage || 0;
          
          // Eliminar el dosificador
          layer.dosifiers = layer.dosifiers.filter(dos => dos.id !== dosifierId);
          
          // Reordenar los IDs de los dosificadores adicionales (no el principal)
          const mainDosifier = layer.dosifiers.find(d => d.id === 0);
          const additionalDosifiers = layer.dosifiers.filter(d => d.id !== 0);
          
          additionalDosifiers.forEach((dos, index) => {
            dos.id = index + 1; // Los IDs comienzan en 1 para dosificadores adicionales
          });
          
          // Redistribuir el porcentaje eliminado
          const additionalDosifiersCount = additionalDosifiers.length;
          if (additionalDosifiersCount > 0) {
            const additionalPercentagePerDosifier = roundToTwoDecimals(percentageToRedistribute / additionalDosifiersCount);
            
            // Asegurar que la suma sea exactamente el porcentaje a redistribuir
            let remaining = percentageToRedistribute;
            
            additionalDosifiers.forEach((dos, index) => {
              if (index === additionalDosifiers.length - 1) {
                dos.percentage += roundToTwoDecimals(remaining);
              } else {
                dos.percentage += additionalPercentagePerDosifier;
                remaining -= additionalPercentagePerDosifier;
              }
            });
          } else {
            // Si no quedan dosificadores adicionales, asignar todo al principal
            if (mainDosifier) {
              mainDosifier.percentage = 100;
            }
          }
          
          // Reconstruir el array de dosificadores en el orden correcto
          layer.dosifiers = mainDosifier 
            ? [mainDosifier, ...additionalDosifiers]
            : additionalDosifiers;
        }
      }
      
      return newLayers;
    });
  };

  // Función para actualizar el material de un dosificador
  const updateDosifierMaterial = (layerId: string, dosifierId: number, materialId: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex((l: Layer) => l.id === layerId);
      
      if (layerIndex !== -1) {
        const layer = newLayers[layerIndex];
        const dosifierIndex = layer.dosifiers.findIndex(dos => dos.id === dosifierId);
        
        if (dosifierIndex !== -1) {
          const selectedMaterial = materials.find(m => m.RAWMAT_RAWMAT === materialId);
          if (selectedMaterial) {
            layer.dosifiers[dosifierIndex].materialId = materialId;
            layer.dosifiers[dosifierIndex].material = selectedMaterial.RAWMAT_SHORT;
          }
        }
      }
      
      return newLayers;
    });
  };

  // Función para actualizar el porcentaje de un dosificador
  const updateDosifierPercentage = (layerId: string, dosifierId: number, percentage: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex((l: Layer) => l.id === layerId);
      
      if (layerIndex !== -1) {
        const layer = newLayers[layerIndex];
        const dosifierIndex = layer.dosifiers.findIndex(dos => dos.id === dosifierId);
        
        if (dosifierIndex !== -1) {
          layer.dosifiers[dosifierIndex].percentage = percentage;
        }
      }
      
      return newLayers;
    });
  };

  // Función para preparar los datos para la BD
  const prepareRecipeData = (formData: z.infer<typeof formSchema>) => {
    const { recipeName, layers } = formData;
    const recipeEntries: RecipeEntry[] = [];

    // Verificar datos
    if (!recipeName || recipeName.trim() === '') {
      console.error("Recipe name is missing");
      return recipeEntries;
    }

    if (!layers || layers.length === 0) {
      console.error("No layers found");
      return recipeEntries;
    }

    // Iterar sobre cada capa
    layers.forEach(layer => {
      if (!layer.dosifiers || layer.dosifiers.length === 0) {
        console.warn(`Layer ${layer.id} has no dosifiers, skipping`);
        return;
      }

      // Iterar sobre cada dosificador en la capa
      layer.dosifiers.forEach(dosifier => {
        // Solo incluir dosificadores que tengan un material asignado
        if (dosifier.materialId) {
          recipeEntries.push({
            RECIPE_REZPNR_UNI: recipeName.trim(),
            RECIPE_SCHICHT: layer.id,
            RECIPE_SCHICHT_ANTEIL: roundToTwoDecimals(layer.percentage),
            RECIPE_REZPNR_MAT: recipeName.trim(),
            RECIPE_COMPONENT: dosifier.id,
            RECIPE_MATERIAL: dosifier.material,
            RECIPE_MATERIAL_ID: dosifier.materialId.toString(),
            RECIPE_DICHTE: null,
            RECIPE_MATERIAL_ANTEIL: roundToTwoDecimals(dosifier.percentage),
            RECIPE_ROHSTOFF: null
          });
        } else {
          console.warn(`Dosifier ${layer.id}-${dosifier.id} has no material assigned, skipping`);
        }
      });
    });

    return recipeEntries;
  };

  // Función para guardar la receta editada en la base de datos
  const updateRecipeInDB = async (recipeEntries: RecipeEntry[]) => {
    try {
      setError(null);
      setLoading(true);
      
      // Verificar que tenemos entradas para guardar
      if (!recipeEntries || recipeEntries.length === 0) {
        setError("No recipe entries to save. Please add materials to dosifiers.");
        return false;
      }
      
      console.log("Updating recipe:", JSON.stringify({ entries: recipeEntries }));
      
      const response = await fetch(`/api/recipe/${recipeUuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries: recipeEntries }),
      });
      
      if (!response.ok) {
        const result = await response.json();
        if (result.errors) {
          // Manejar errores de validación
          const errorMessage = Array.isArray(result.errors) 
            ? result.errors
                .map((err: { path: string[], message: string }) => `${err.path.join('.')}: ${err.message}`)
                .join(', ')
            : "Validation error";
          
          setError(`Validation error: ${errorMessage}`);
        } else {
          setError(result.error || 'Failed to update recipe');
        }
        return false;
      }
      
      // Éxito
      console.log('Recipe updated successfully');
      
      // Llamar al callback de éxito si existe
      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        // O mostrar mensaje genérico
        alert("Recipe updated successfully!");
      }
      
      return true;
    } catch (error) {
      console.error('Error updating recipe:', error);
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isLayersValid = validateLayerPercentages();
    
    let isDosifiersValid = true;
    for (const layer of layers) {
      if (!validateDosifierPercentages(layer.id)) {
        isDosifiersValid = false;
        break;
      }
    }
    
    if (isLayersValid && isDosifiersValid) {
      form.handleSubmit(async (data) => {
        // Comprobar que el nombre de la receta no esté vacío
        if (!data.recipeName.trim()) {
          setError("Recipe name is required");
          return;
        }
        
        // Actualizar las capas actuales en los datos del formulario
        data.layers = layers;
        
        console.log("Valid recipe:", data);
        
        // Preparar los datos para la BD
        const recipeEntries = prepareRecipeData(data);
        console.log("Recipe entries for database:", recipeEntries);
        
        // Verificar que al menos haya un dosificador con material asignado
        if (recipeEntries.length === 0) {
          setError("At least one dosifier must have a material assigned");
          return;
        }
        
        // Enviar los datos a la API
        await updateRecipeInDB(recipeEntries);
      })();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Campo para el nombre de la receta */}
              <div>
                <FormLabel>Recipe Name</FormLabel>
                <div className="flex items-center mt-1">
                  <Input
                    type="text"
                    maxLength={20}
                    placeholder="Enter recipe name"
                    value={form.watch("recipeName")}
                    onChange={(e) => {
                      form.setValue("recipeName", e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
                {form.formState.errors.recipeName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.recipeName.message}
                  </p>
                )}
              </div>

              <div>
                <FormLabel>Number of Layers (1-9)</FormLabel>
                <div className="flex items-center space-x-2 mt-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNumLayers(prev => Math.max(1, prev - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 border rounded-md text-center min-w-[3rem]">
                    {numLayers}
                  </span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNumLayers(prev => Math.min(9, prev + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-800 rounded-md">
                  {error}
                </div>
              )}

              {layers.map((layer) => (
                <Card key={layer.id} className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {layer.name} ({layer.id})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Layer Percentage in Recipe</FormLabel>
                        <div className="flex items-center mt-1">
                          <Input 
                            type="number" 
                            value={roundToTwoDecimals(layer.percentage)} 
                            min="0" 
                            max="100"
                            step="0.01"
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value);
                              if (!isNaN(newValue)) {
                                updateLayerPercentage(layer.id, roundToTwoDecimals(newValue));
                              }
                            }}
                            onBlur={() => validateLayerPercentages()}
                            className="w-24"
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <FormLabel>Dosifiers</FormLabel>
                          {layer.dosifiers.length < 9 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => addDosifier(layer.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                          {layer.dosifiers.map((dosifier) => {
                            // Formato correcto del ID del dosificador (A, A1, A2, etc.)
                            const dosifierLabel = dosifier.id === 0 
                              ? layer.id // Para el principal (A, B, C...)
                              : `${layer.id}${dosifier.id}`; // Para los adicionales (A1, A2, B1, B2...)
                            
                            return (
                              <div 
                                key={`${layer.id}-${dosifier.id}`} 
                                className="flex flex-col p-3 border rounded-md shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-lg">{dosifierLabel}</span>
                                  {dosifier.id !== 0 && (
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeDosifier(layer.id, dosifier.id)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <FormLabel className="text-xs">Material</FormLabel>
                                    <Select 
                                      onValueChange={(value) => updateDosifierMaterial(layer.id, dosifier.id, parseInt(value))}
                                      value={dosifier.materialId?.toString() || ""}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select material" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {materials.map((material) => (
                                          <SelectItem 
                                            key={material.RAWMAT_RAWMAT}
                                            value={material.RAWMAT_RAWMAT.toString()}
                                          >
                                            {material.RAWMAT_SHORT || `Material ${material.RAWMAT_RAWMAT}`}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <FormLabel className="text-xs">Percentage</FormLabel>
                                    <div className="flex items-center">
                                      <Input 
                                        type="number" 
                                        value={roundToTwoDecimals(dosifier.percentage)} 
                                        min="0" 
                                        max="100"
                                        step="0.01"
                                        onChange={(e) => {
                                          const newValue = parseFloat(e.target.value);
                                          if (!isNaN(newValue)) {
                                            updateDosifierPercentage(layer.id, dosifier.id, roundToTwoDecimals(newValue));
                                          }
                                        }}
                                        onBlur={() => validateDosifierPercentages(layer.id)}
                                        className="w-full"
                                      />
                                      <span className="ml-1">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button 
                type="submit" 
                className="mt-6 w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Recipe'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}