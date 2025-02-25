"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MaterialFormProps } from "./MaterialForm.interface"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"
import { formSchema } from "./MaterialForm.form"
import { Button } from "@/components/ui/button"

const colorOptions = [
    { value: "red", label: "Red", hex: "#FF0000" },
    { value: "blue", label: "Blue", hex: "#0000FF" },
    { value: "green", label: "Green", hex: "#00FF00" },
    { value: "yellow", label: "Yellow", hex: "#FFFF00" },
    { value: "purple", label: "Purple", hex: "#800080" },
];


export function MaterialForm(props: MaterialFormProps) {
    const { material } = props
    const router = useRouter()

    

    const form = useForm<z.infer<typeof formSchema>>( {
        resolver: zodResolver(formSchema),
        defaultValues: {
            RAWMAT_NAME: material.RAWMAT_NAME,
            RAWMAT_SHORT: material.RAWMAT_SHORT ?? "",
            RAWMAT_DENSITY: material.RAWMAT_DENSITY,
            RAWMAT_MFIVAL: material.RAWMAT_MFIVAL,
            RAWMAT_BULKDENS: material.RAWMAT_BULKDENS,
            RAWMAT_RAWTYP: material.RAWMAT_RAWTYP ?? 0,
            RAWMAT_ARTN: material.RAWMAT_ARTN ?? "",
            RAWMAT_COLOR: Number(material.RAWMAT_COLOR),

        }
    } )

    // const { isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`../api/material/${material.RAWMAT_RAWMAT}`, values)
            toast({title: "Material edited"})
            router.refresh()
        } catch (e) {
            toast({
                title: "Something went wrong",
                variant: "destructive",
            })
            console.log(e)
        }
    }
    console.log(material.RAWMAT_COLOR)
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="RAWMAT_NAME"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Code
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Polycol..." type="text" {...field} />
                            </FormControl>
                        </FormItem>
                    )}

                />
                <FormField
                control={form.control}
                name="RAWMAT_SHORT"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Material</FormLabel>
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
                    <FormLabel>Density g/ccm</FormLabel>
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
                    <FormLabel>MFI g/10 min</FormLabel>
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
                    <FormLabel>Density Bulk</FormLabel>
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
                        <FormLabel>Type</FormLabel>
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
                            <SelectItem value="1">PE_BD</SelectItem>
                            <SelectItem value="2">HDPE</SelectItem>
                            <SelectItem value="3">RCY</SelectItem>
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
                        <FormLabel>Article</FormLabel>
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
                        <FormLabel>Color</FormLabel>
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
            <Button type="submit" >Edit Material</Button>
        </form>
    </Form>
  )
}
