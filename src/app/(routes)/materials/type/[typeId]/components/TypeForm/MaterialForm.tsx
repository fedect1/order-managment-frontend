"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TypeFormProps } from "./TypeForm.interface"
import { formSchema } from "./TypeForm.form"



export function TypeForm(props: TypeFormProps) {
    const { type } = props
    const router = useRouter()

    

    const form = useForm<z.infer<typeof formSchema>>( {
        resolver: zodResolver(formSchema),
        defaultValues: {
            RAWTYP_SHORT: type.RAWTYP_SHORT,
            RAWTYP_DESC: type.RAWTYP_DESC ?? "",
        }
    } )

    // const { isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/type/${type.RAWTYP_RAWTYP}`, values)
            toast({title: "Type edited"})
            router.refresh()
        } catch (e) {
            toast({
                title: "Something went wrong",
                variant: "destructive",
            })
            console.log(e)
        }
    }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="RAWTYP_SHORT"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="HPS..." type="text" {...field} />
                            </FormControl>
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
                        <Input placeholder="Description..." type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <Button type="submit" >Edit Type</Button>
        </form>
    </Form>
  )
}
