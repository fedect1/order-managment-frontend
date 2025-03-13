"use client"

import { z } from "zod"

const formSchema = z.object({
    job_number: z.string().min(2),
    product_number: z.string().min(2),
    quantity_kg: z.coerce.number().positive(),
    consumption_kg_h: z.coerce.number().positive(),
    pml_target_g_m: z.coerce.number().positive(),
    width_mm: z.coerce.number().int().positive(),
    gusset_mm: z.coerce.number().int().positive(),
    linea_id: z.coerce.number().int().positive(),
})

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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormCreateOrderProps } from "./FormCreateOrder.interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FormCreateOrder(props: FormCreateOrderProps) {
    const { setOpenModalCreate } = props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            job_number: "",
            product_number: "",
            quantity_kg: 0,
            consumption_kg_h: 0,
            pml_target_g_m: 0,
            width_mm: 0,
            gusset_mm: 0,
            linea_id: 0,
        },
        mode: "onChange",
    })

    const { isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        setOpenModalCreate(false)
    }

  return (
    <Form {...form}>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-2">
            <FormField
            control={form.control}
            name="job_number"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Order/job number (No. ordine)</FormLabel>
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
                <FormLabel>Product or article number (No. prodotto)</FormLabel>
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
                <FormLabel>Total product quantity in kg</FormLabel>
                <FormControl>
                    <Input placeholder="500" type="number" step="0.01" min="0" {...field} />
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
                <FormLabel>Production speed in kg/h</FormLabel>
                <FormControl>
                    <Input placeholder="25.55" type="number" step="0.01" min="0" {...field} />
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
                <FormLabel>Target weight per meter of film in g/m</FormLabel>
                <FormControl>
                    <Input placeholder="18.75" type="number" step="0.01" min="0" {...field} />
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
                <FormLabel>Gross width in mm (Larghezza)</FormLabel>
                <FormControl>
                    <Input placeholder="600" type="number" min="0" {...field} />
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
                <FormLabel>Gusset size (soffietti) in mm</FormLabel>
                <FormControl>
                    <Input placeholder="100" type="number" min="0" {...field} />
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
                <FormLabel>Assigned line identifier</FormLabel>
                <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value.toString()}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select line"/>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="1">Line 1</SelectItem>
                        <SelectItem value="2">Line 2</SelectItem>
                        <SelectItem value="3">Line 3</SelectItem>
                        <SelectItem value="4">Line 4</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" disabled={!isValid}>Submit</Button>
      </form>
    </Form>
    </Form>
  )
}
