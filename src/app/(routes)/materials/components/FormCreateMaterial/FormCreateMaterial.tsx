"use client"

import { z } from "zod";
import axios from "axios";

const densitySchema = z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val)
    return val
  }, z.number()
    .gt(0, { message: "Value must be greater than 0" })
    .lt(1, { message: "Value must be less than 1" })
)

const optionalDensitySchema = z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val)
    if (val === "") return undefined
    return val
  }, z.number()
    .gt(0, { message: "Value must be greater than 0" })
    .lt(1, { message: "Value must be less than 1" })
    .optional()
)

const formSchema = z.object({
  // Campos obligatorios
  RAWMAT_NAME: z.string().min(1, { message: "Code is required" }),
  RAWMAT_SHORT: z.string().min(2, { message: "Material name must have at least 2 characters" }),
  RAWMAT_DENSITY: densitySchema,
  RAWMAT_RAWTYP: z.number().min(1, { message: "Type is required" }),
  RAWMAT_COLOR: z.number().min(5, { message: "Color is required" }),
  
  // Campos opcionales
  RAWMAT_MFIVAL: optionalDensitySchema,
  RAWMAT_BULKDENS: optionalDensitySchema,
  RAWMAT_ARTN: z.string().optional(),
});


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
import { FormCreateMaterialProps } from "./FormCreateMaterial.interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';


const colorOptions = [
    { value: "red", label: "Red", hex: "#FF0000" },
    { value: "blue", label: "Blue", hex: "#0000FF" },
    { value: "green", label: "Green", hex: "#00FF00" },
    { value: "yellow", label: "Yellow", hex: "#FFFF00" },
    { value: "purple", label: "Purple", hex: "#800080" },
];


export function FormCreateMaterial(props: FormCreateMaterialProps) {
    const { setOpenModalCreate, rawTypes } = props

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            RAWMAT_NAME: "",
            RAWMAT_SHORT: "",
            RAWMAT_DENSITY: 0,
            RAWMAT_MFIVAL: undefined,
            RAWMAT_BULKDENS: undefined,
            RAWMAT_RAWTYP: 0,
            RAWMAT_ARTN: "",
            RAWMAT_COLOR: 0,
        },
        mode: "onChange",
    })

    const { isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/material", values)
            toast({title: "Material created"})
            router.refresh()
            setOpenModalCreate(false)
        } catch (error) {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
            console.log(error)
        }
        setOpenModalCreate(false)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-2">
            <FormField
            control={form.control}
            name="RAWMAT_NAME"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Kod *</FormLabel>
                <FormControl>
                    <Input placeholder="Polycol..." type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="RAWMAT_SHORT"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Materiał *</FormLabel>
                <FormControl>
                    <Input placeholder="B.D. POLYAIR BIANC..." type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="RAWMAT_DENSITY"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Gęstość g/cm³ *</FormLabel>
                <FormControl>
                    <Input type="number" min={0} step={0.001} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="RAWMAT_MFIVAL"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Wartość MFI</FormLabel>
                <FormControl>
                    <Input type="number" min={0} step={0.001} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="RAWMAT_BULKDENS"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Gęstość nasypowa</FormLabel>
                <FormControl>
                    <Input type="number" min={0} step={0.001} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="RAWMAT_RAWTYP"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Typ *</FormLabel>
                    <Select
                        onValueChange={(value: string) => field.onChange(Number(value))}
                        defaultValue={String(field.value)}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select the type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {rawTypes.map((type) => (
                            <SelectItem key={type.RAWTYP_RAWTYP} value={String(type.RAWTYP_RAWTYP)}>
                                {type.RAWTYP_SHORT}{type.RAWTYP_DESC ? ` - ${type.RAWTYP_DESC}` : ''}
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
            name="RAWMAT_ARTN"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Artykuł</FormLabel>
                <FormControl>
                    <Input placeholder="POLYAIR..." type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="RAWMAT_COLOR"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Kolor *</FormLabel>
                <Select
                    onValueChange={(value: string) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {colorOptions.map((color) => {
                        // Convertir el valor hexadecimal (ej: "#FF0000") a número
                        const numericHex = parseInt(color.hex.replace('#', ''), 16)
                        return (
                        <SelectItem key={color.value} value={String(numericHex)}>
                            <div className="flex items-center space-x-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.label}</span>
                            </div>
                        </SelectItem>
                        )
                    })}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

        </div>
        <Button type="submit" disabled={!isValid}>Prześlij</Button>
      </form>
    </Form>
  )
}