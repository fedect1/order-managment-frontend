"use client"

import { z } from "zod"

const densitySchema = z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val)
    return val
  }, z.number()
    .gt(0, { message: "Value must be greater than 0" })
    .lt(1, { message: "Value must be less than 1" })
)

const formSchema = z.object({
  code: z.string(),
  nameMat: z.string().min(2),
  densityGCcm: densitySchema,
  mfi: densitySchema,
  densityBulk: densitySchema,
  type: z.string().min(6),
  article: z.string().min(6),
  color: z.string().min(6),
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

const colorOptions = [
    { value: "red", label: "Red", hex: "#FF0000" },
    { value: "blue", label: "Blue", hex: "#0000FF" },
    { value: "green", label: "Green", hex: "#00FF00" },
    { value: "yellow", label: "Yellow", hex: "#FFFF00" },
    { value: "purple", label: "Purple", hex: "#800080" },
];


export function FormCreateMaterial(props: FormCreateMaterialProps) {
    const { setOpenModalCreate } = props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            nameMat: "",
            densityGCcm: 0,
            mfi: 0,
            densityBulk: 0,
            type: "",
            article: "",
            color: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-2">
            <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                    <Input placeholder="Polycol..." type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="nameMat"
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
            name="densityGCcm"
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
            name="mfi"
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
            name="densityBulk"
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
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select the type"/>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="PE_BD">
                            PE_BD
                        </SelectItem>
                        <SelectItem value="HDPE">
                            HDPE
                        </SelectItem>
                        <SelectItem value="RCY">
                            RCY
                        </SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="article"
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
            name="color"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Color</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center space-x-2">
                            <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.label}</span>
                        </div>
                        </SelectItem>
                    ))}
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
  )
}
