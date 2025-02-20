"use client"

import { z } from "zod"

const formSchema = z.object({
  name: z.string(),
  country: z.string().min(2),
  website: z.string().min(2),
  phone: z.string().min(6),
  cif: z.string().min(6),
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
import { FormCreateCustomerProps } from "./FormCreateCustomer.interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FormCreateCustomer(props: FormCreateCustomerProps) {
    const { setOpenModalCreate } = props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            country: "",
            website: "",
            phone: "",
            cif: "",
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
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input placeholder="Company name..." type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select the country"/>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="united-kindom">
                            United Kindom
                        </SelectItem>
                        <SelectItem value="Argentina">
                            Argentina
                        </SelectItem>
                        <SelectItem value="uruguay">
                            Uruguay
                        </SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                    <Input placeholder="www.fede.com" type="text" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                    <Input placeholder="+34 55 21265" type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cif"
            render={({ field }) => (
                <FormItem>
                <FormLabel>CIF</FormLabel>
                <FormControl>
                    <Input placeholder="8-12345" type="text" {...field} />
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
