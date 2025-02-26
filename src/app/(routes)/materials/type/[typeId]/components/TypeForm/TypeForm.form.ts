import { z } from "zod";

export const formSchema = z.object({
  RAWTYP_SHORT: z.string().min(1),
  RAWTYP_DESC: z.string().min(1),
});
