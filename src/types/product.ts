import z from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  stock: z.number(),
  price: z.number(),
  product_image: z.string().url(),
});

export const ProductEditSchema = z.object({
  name: z.string().optional(),
  stock: z.number().optional(),
  price: z.number().optional(),
});

export type ProductType = z.infer<typeof ProductSchema>;
export type ProductEditType = z.infer<typeof ProductEditSchema>;