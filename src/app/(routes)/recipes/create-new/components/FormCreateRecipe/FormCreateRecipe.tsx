"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
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
import { FormCreateRecipeProps } from "./FormCreateRecipe.interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Minus } from "lucide-react";

// Interface for a dosifier
interface Dosifier {
  id: number;
  materialId: number | null;
  material: string | null;
  percentage: number;
}

// Interface for a layer
interface Layer {
  id: string;
  name: string;
  percentage: number;
  dosifiers: Dosifier[];
}

// Zod schema for validation
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
  layers: z.array(layerSchema),
  totalLayers: z.number().min(1).max(9)
});

export function FormCreateRecipe(props: FormCreateRecipeProps) {
  const { materials } = props;
  const [numLayers, setNumLayers] = useState(1);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      layers: [],
      totalLayers: 1
    },
    mode: "onChange",
  });

  // Initialize the layers when the number of layers changes
  // Versión corregida del useEffect
// Versión corregida del useEffect
useEffect(() => {
    // Usar el patrón de actualización funcional para evitar dependencias circulares
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
        const percentagePerLayer = 100 / totalLayers;
        newLayers.forEach(layer => {
          layer.percentage = percentagePerLayer;
        });
      }
      
      return newLayers;
    });
  
    // Actualizar valores del formulario
    form.setValue('totalLayers', numLayers);
    
    // No es necesario llamar a form.setValue('layers', newLayers) aquí
    // porque setLayers ya actualizará el estado y desencadenará una renderización
    // donde podemos actualizar el formulario con los valores actualizados
  }, [numLayers, form]);

  // Function to validate that the sum of layer percentages is 100%
  const validateLayerPercentages = () => {
    const totalSum = layers.reduce((total, layer) => total + layer.percentage, 0);
    if (Math.round(totalSum) !== 100) {
      setError(`The sum of layer percentages must be 100%. Currently: ${totalSum.toFixed(2)}%`);
      return false;
    }
    setError(null);
    return true;
  };

  // Function to validate that the sum of dosifier percentages in a layer is 100%
  const validateDosifierPercentages = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      const totalSum = layer.dosifiers.reduce((total, dos) => total + dos.percentage, 0);
      if (Math.round(totalSum) > 100) {
        setError(`The sum of dosifier percentages in Layer ${layerId} cannot exceed 100%. Currently: ${totalSum.toFixed(2)}%`);
        return false;
      }
      if (Math.round(totalSum) < 100) {
        setError(`The sum of dosifier percentages in Layer ${layerId} must be 100%. Currently: ${totalSum.toFixed(2)}%`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Function to update a layer's percentage
  const updateLayerPercentage = (layerId: string, newPercentage: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex(l => l.id === layerId);
      
      if (layerIndex !== -1) {
        newLayers[layerIndex].percentage = newPercentage;
      }
      
      // Update form value
      form.setValue('layers', newLayers);
      
      return newLayers;
    });
  };

// Versión corregida de la función addDosifier
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
          const percentagePerAdditionalDosifier = remainingPercentage / additionalDosifiersCount;
          
          for (let i = 1; i < layer.dosifiers.length; i++) {
            layer.dosifiers[i].percentage = percentagePerAdditionalDosifier;
          }
        }
        
        // Actualizar el valor del formulario
        form.setValue('layers', newLayers);
      }
      
      return newLayers;
    });
  };

  // Function to remove a dosifier from a layer
  const removeDosifier = (layerId: string, dosifierId: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex(l => l.id === layerId);
      
      if (layerIndex !== -1) {
        const layer = newLayers[layerIndex];
        
        // Only dosifiers with id > 0 can be removed (not the main one)
        if (dosifierId > 0) {
          // Get the percentage of the dosifier being removed
          const dosifierToRemove = layer.dosifiers.find(d => d.id === dosifierId);
          const percentageToRedistribute = dosifierToRemove?.percentage || 0;
          
          // Remove the dosifier
          layer.dosifiers = layer.dosifiers.filter(dos => dos.id !== dosifierId);
          
          // Reorder the IDs of additional dosifiers (not the main one)
          const mainDosifier = layer.dosifiers.find(d => d.id === 0);
          const additionalDosifiers = layer.dosifiers.filter(d => d.id !== 0);
          
          additionalDosifiers.forEach((dos, index) => {
            dos.id = index + 1; // IDs start at 1 for additional dosifiers
          });
          
          // Redistribute the removed percentage
          const additionalDosifiersCount = additionalDosifiers.length;
          if (additionalDosifiersCount > 0) {
            const additionalPercentagePerDosifier = percentageToRedistribute / additionalDosifiersCount;
            additionalDosifiers.forEach(dos => {
              dos.percentage += additionalPercentagePerDosifier;
            });
          } else {
            // If there are no additional dosifiers left, assign everything to the main one
            if (mainDosifier) {
              mainDosifier.percentage = 100;
            }
          }
          
          // Rebuild the dosifier array in the correct order
          layer.dosifiers = mainDosifier 
            ? [mainDosifier, ...additionalDosifiers]
            : additionalDosifiers;
        }
      }
      
      // Update form value
      form.setValue('layers', newLayers);
      
      return newLayers;
    });
  };

  // Function to update the material of a dosifier
  const updateDosifierMaterial = (layerId: string, dosifierId: number, materialId: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex(l => l.id === layerId);
      
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
      
      // Update form value
      form.setValue('layers', newLayers);
      
      return newLayers;
    });
  };

  // Function to update the percentage of a dosifier
  const updateDosifierPercentage = (layerId: string, dosifierId: number, percentage: number) => {
    setLayers(prevLayers => {
      const newLayers = [...prevLayers];
      const layerIndex = newLayers.findIndex(l => l.id === layerId);
      
      if (layerIndex !== -1) {
        const layer = newLayers[layerIndex];
        const dosifierIndex = layer.dosifiers.findIndex(dos => dos.id === dosifierId);
        
        if (dosifierIndex !== -1) {
          layer.dosifiers[dosifierIndex].percentage = percentage;
        }
      }
      
      // Update form value
      form.setValue('layers', newLayers);
      
      return newLayers;
    });
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
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
      form.handleSubmit((data) => {
        console.log("Valid recipe:", data);
        // Here you would process the form submission
      })();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                            value={layer.percentage} 
                            min="0" 
                            max="100"
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value);
                              if (!isNaN(newValue)) {
                                updateLayerPercentage(layer.id, newValue);
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
                            // Format the dosifier ID correctly (A, A1, A2, etc.)
                            const dosifierLabel = dosifier.id === 0 
                              ? layer.id // For the main one (A, B, C...)
                              : `${layer.id}${dosifier.id}`; // For additional ones (A1, A2, B1, B2...)
                            
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
                                        value={dosifier.percentage} 
                                        min="0" 
                                        max="100"
                                        onChange={(e) => {
                                          const newValue = parseFloat(e.target.value);
                                          if (!isNaN(newValue)) {
                                            updateDosifierPercentage(layer.id, dosifier.id, newValue);
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
              >
                Save Recipe
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}