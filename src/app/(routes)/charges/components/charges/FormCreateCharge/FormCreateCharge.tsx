"use client";

import { z } from "zod";
import axios from "axios";

const formSchema = z.object({
  RAWMAT_NAME: z.string(),
  RAWMAT_SHORT: z.string().min(2),
  RAWMAT_RAWTYP: z.number().min(1),
  RAWMAT_ARTN: z.string().min(6),
  RAWMAT_COLOR: z.number().min(5),
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormCreateChargeProps } from "./FormCreateCharge.interface";
import { DialogChargeProps } from "../DialogCharge/DialogCharge.interface";

export function FormCreateCharge({
  setOpenModalCreate,
  materials,
}: FormCreateChargeProps & { materials: DialogChargeProps }) {
  const router = useRouter();

  console.log(materials)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      RAWMAT_NAME: "",
      RAWMAT_SHORT: "",
      RAWMAT_RAWTYP: 0,
      RAWMAT_ARTN: "",
      RAWMAT_COLOR: 0,
    },
    mode: "onChange",
  });

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/material", values);
      toast({ title: "Material created" });
      router.refresh();
      setOpenModalCreate(false);
    } catch (e) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      console.log(e);
    }
    setOpenModalCreate(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="RAWMAT_NAME"
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
            name="RAWMAT_RAWTYP"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Material</FormLabel>
                <Select
                    onValueChange={(value: string) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona el material" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {materials.map((material) => (
                        <SelectItem
                        key={material.RAWMAT_RAWMAT}
                        value={String(material.RAWMAT_RAWMAT)}
                        >
                        {material.RAWMAT_NAME} - {material.RAWMAT_COLOR.toString()} - {material.RAWMAT_DENSITY}
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
                    {[
                      { value: "red", label: "Red", hex: "#FF0000" },
                      { value: "blue", label: "Blue", hex: "#0000FF" },
                      { value: "green", label: "Green", hex: "#00FF00" },
                      { value: "yellow", label: "Yellow", hex: "#FFFF00" },
                      { value: "purple", label: "Purple", hex: "#800080" },
                    ].map((color) => {
                      const numericHex = parseInt(color.hex.replace("#", ""), 16);
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
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
