import z from "zod";

export const DiscountSchema = z.object({
  id: z.number(),
  disc_code: z.string().min(5, "Harus 5 character").max(5, "Harus 5 character"),
  percentage: z.number(),
});

export const DiscountEditSchema = z.object({
  id: z.number(),
  disc_code: z.string().min(5, "Harus 5 character").max(5, "Harus 5 character"),
  percentage: z.number(),
});

export type DiscountType = z.infer<typeof DiscountSchema>;
export type DiscountEditType = z.infer<typeof DiscountEditSchema>;
