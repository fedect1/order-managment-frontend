import { z } from "zod";


const densitySchema = z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val)
    return val
  }, z.number()
    .gt(0, { message: "Value must be greater than 0" })
    .lt(1, { message: "Value must be less than 1" })
)

export const formSchema = z.object({
  RAWMAT_NAME: z.string(),
  RAWMAT_SHORT: z.string().min(2),
  RAWMAT_DENSITY: densitySchema,
  RAWMAT_MFIVAL: densitySchema,
  RAWMAT_BULKDENS: densitySchema,
  RAWMAT_RAWTYP: z.number().min(1),
  RAWMAT_ARTN: z.string().min(6),
  RAWMAT_COLOR: z.number().min(5),
});
