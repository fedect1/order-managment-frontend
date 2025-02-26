"use client"

import { z } from "zod"

const formSchema = z.object({
  RAWTYP_SHORT: z.string().min(1),
  RAWTYP_DESC: z.string().min(2),
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
import { FormCreateTypeProps } from "./FormCreateType.interface"
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";



export function FormCreateType(props: FormCreateTypeProps) {
    const { setOpenModalCreate } = props

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            RAWTYP_SHORT: "",
            RAWTYP_DESC: "",
        },
        mode: "onChange",
    })

    const { isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        await axios.post("/api/type", values)
        toast({title: "Material created"})
        router.refresh()
        setOpenModalCreate(false)
      } catch (error) {
        toast({
            title: "Something went wrong",
            variant: "destructive"
        })
    }
    setOpenModalCreate(false)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-2">
            <FormField
            control={form.control}
            name="RAWTYP_SHORT"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input placeholder="HDPE..." type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="RAWTYP_DESC"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Input placeholder="PE High Density" type="text" {...field} />
                </FormControl>
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
