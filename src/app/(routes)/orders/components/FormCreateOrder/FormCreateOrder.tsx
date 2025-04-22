"use client"

import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormCreateOrderProps } from "./FormCreateOrder.interface"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  job_number: z.string().min(2, "El número de orden debe tener al menos 2 caracteres"),
  product_number: z.string().min(2, "El número de producto debe tener al menos 2 caracteres"),
  quantity_kg: z.coerce.number().positive("La cantidad debe ser positiva"),
  consumption_kg_h: z.coerce.number().positive("El consumo debe ser positivo"),
  pml_target_g_m: z.coerce.number().positive("El peso objetivo debe ser positivo"),
  width_mm: z.coerce.number().int().positive("El ancho debe ser un entero positivo"),
  gusset_mm: z.coerce.number().int().positive("El tamaño de fuelle debe ser un entero positivo"),
  linea_id: z.coerce.number().int().positive("Debe seleccionar una línea"),
  recipe_uuid: z.string().uuid().optional(),
})

export function FormCreateOrder(props: FormCreateOrderProps) {
  const { setOpenModalCreate, lineList, recipeList } = props
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_number: "",
      product_number: "",
      quantity_kg: 0, // Usar 0 en lugar de undefined
      consumption_kg_h: 0, // Usar 0 en lugar de undefined
      pml_target_g_m: 0, // Usar 0 en lugar de undefined
      width_mm: 0, // Usar 0 en lugar de undefined
      gusset_mm: 0, // Usar 0 en lugar de undefined
      linea_id: 0, // Usar 0 en lugar de undefined
      recipe_uuid: "none" // Usar "none" en lugar de undefined
    },
    mode: "onChange",
  })

  const { isValid, isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // Transformar los datos antes de enviarlos si es necesario
      const dataToSend = {
        ...values,
        // Si recipe_uuid está como "none", enviamos undefined
        recipe_uuid: values.recipe_uuid === "none" ? undefined : values.recipe_uuid
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Orden created",
          description: `The order ${values.job_number} has been created and added to the production queue.`,
          
        })
        setOpenModalCreate(false)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Order could not be created",
        })
      }
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "The order could not be created. Check your connection and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="job_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer zamówienia/zadania</FormLabel>
                <FormControl>
                  <Input placeholder="JOB-20250306-A" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer produktu lub artykułu</FormLabel>
                <FormControl>
                  <Input placeholder="PROD-5678" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ogólna ilość produktu w kg</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="500" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={field.value || ""} // Asegurar que siempre haya un valor
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consumption_kg_h"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prędkość produkcyjna w kg/h</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="25.55" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={field.value || ""} // Asegurar que siempre haya un valor
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pml_target_g_m"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zadana wartość gramatury folii w g/m</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="18.75" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={field.value || ""} // Asegurar que siempre haya un valor
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="width_mm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Szerokość brutto w mm</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="600" 
                    type="number" 
                    min="0" 
                    value={field.value || ""} // Asegurar que siempre haya un valor
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gusset_mm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rozmiar fałdu [mm]</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="100" 
                    type="number" 
                    min="0" 
                    value={field.value || ""} // Asegurar que siempre haya un valor
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linea_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Przypisany identyfikator linii</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() || "0"} // Asegurar que siempre haya un valor
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select line"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lineList.map((line) => (
                      <SelectItem key={line.LINE_ID} value={line.LINE_ID.toString()}>
                        {line.LINE_NAME}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recipe_uuid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Przypisana receptura</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value || "none"} // Asegurar que siempre haya un valor
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipe"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Brak receptury</SelectItem>
                    {recipeList.map((recipe) => (
                      <SelectItem key={recipe.RECIPE_UUID} value={recipe.RECIPE_UUID}>
                        {recipe.RECIPE_REZPNR_UNI}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpenModalCreate(false)}
            disabled={isSubmitting}
          >
            Anuluj
          </Button>
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Creating..." : "Prześlij"}
          </Button>
        </div>
      </form>
    </Form>
  )
}