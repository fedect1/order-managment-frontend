"use client";

import { z } from "zod";
import axios from "axios";

const formSchema = z.object({
  RAWCHARGE_RAWMAT: z.preprocess((val) => Number(val), z.number()),
  RAWCHARGE_CHARGENR: z.string().min(2),
  RAWCHARGE_AMOUNT: z.preprocess((val) => Number(val), z.number().min(1)),
  RAWCHARGE_ACTAMOUNT: z.preprocess((val) => Number(val), z.number().min(1)),
  RAWCHARGE_STATE: z.preprocess((val) => Number(val), z.number().min(1)),
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
// Importa la interfaz FormCreateChargeProps desde DialogCharge.interface.ts
import { FormCreateChargeProps } from "../DialogCharge/DialogCharge.interface";

// Usa solo FormCreateChargeProps (que ya incluye materials)
export function FormCreateCharge({
  setOpenModalCreate,
  materials,
}: FormCreateChargeProps) {
  const router = useRouter();

  console.log(materials);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      RAWCHARGE_RAWMAT: 0,
      RAWCHARGE_CHARGENR: "",
      RAWCHARGE_AMOUNT: 0,
      RAWCHARGE_ACTAMOUNT: 0,
      RAWCHARGE_STATE: 0,
    },
    mode: "onChange",
  });

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/charge", values);
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
            name="RAWCHARGE_CHARGENR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charge</FormLabel>
                <FormControl>
                  <Input placeholder="Polycol..." type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="RAWCHARGE_AMOUNT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter amount..."
                    type="number"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="RAWCHARGE_ACTAMOUNT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Actual amount..." type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="RAWCHARGE_STATE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Actual amount..." type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="RAWCHARGE_RAWMAT"
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
                      {material.RAWMAT_NAME} - {String(material.RAWMAT_COLOR)} - {material.RAWMAT_DENSITY}
                    </SelectItem>
                  ))}
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