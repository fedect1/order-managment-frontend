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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormCreateBulkProps } from './CreateBulkForm.interface';
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2),
  charge: z.string().min(2),
  capacity: z.preprocess((val) => Number(val), z.number().min(1)),
  actAmount: z.preprocess((val) => Number(val), z.number().min(1)),
  bulkColor: z.enum(["blue", "green", "gray", "yellow", "red"]),
});

export function CreateBulkForm({ setOpenModalCreate }:FormCreateBulkProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        charge: "",
        capacity: 0,
        actAmount: 0,
        bulkColor: "blue"
      },
      mode: "onChange",
    });
    const { isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        console.log(values)
        toast({ title: "Bulk created" });
        router.refresh();
        setOpenModalCreate(false)
      } catch (e) {
        toast({
          title: "Something went wrong",
          variant: "destructive"
        })
        setOpenModalCreate(false)
        console.log(e)
      }
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
                <FormLabel>
                  Bulk
                </FormLabel>
                <FormControl>
                  <Input placeholder="Bulk 1" type="text" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="Enter capacity..." type="number" min={0} {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Current Amount
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter current amount" type="number" min={0} {...field}/>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="charge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Charge
                </FormLabel>
                <Select
                  onValueChange={(value: string) => field.onChange(Number(value))}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Charge"/>
                    </SelectTrigger>
                  </FormControl>
                <SelectContent>
                  <SelectItem
                    key={"asp"}
                    value="asp"
                    >
                    asp - Recicle - Density: 0.985
                  </SelectItem>
                  <SelectItem
                    key={"asp1"}
                    value="asp1"
                    >
                    asp1 - Recicle1 - Density: 0.9851
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bulkColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Color of the Bulk
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Color"/>
                    </SelectTrigger>
                  </FormControl>
                <SelectContent>
                  <SelectItem
                    key={"blue"}
                    value="blue"
                    >
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-6 rounded-md mr-2" 
                        style={{ backgroundColor: "#4682B4" }}
                      ></div>
                      <span>Blue</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    key={"green"}
                    value="green"
                    >
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-6 rounded-md mr-2" 
                        style={{ backgroundColor: "#4CAF50" }}
                      ></div>
                      <span>Green</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    key={"gray"}
                    value="gray"
                    >
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-6 rounded-md mr-2" 
                        style={{ backgroundColor: "#A0A0A0" }}
                      ></div>
                      <span>Gray</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    key={"yellow"}
                    value="yellow"
                    >
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-6 rounded-md mr-2" 
                        style={{ backgroundColor: "#FFC107" }}
                      ></div>
                      <span>Yellow</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    key={"red"}
                    value="red"
                    >
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-6 rounded-md mr-2" 
                        style={{ backgroundColor: "#F44336" }}
                      ></div>
                      <span>Red</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
