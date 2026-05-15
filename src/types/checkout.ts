import z from "zod";
import { ProductSchema } from "./product";

export const AddCheckoutSchema = z.object({
  name: z.string(),
  phone: z.string(),
  disc_code: z.string().optional(),
  payment_method: z.enum(["cash", "QRIS"]),
  upload_recipt: z.string().optional(),
  product_checkout: z.array(
    z.object({
      quantity: z.number(),
      product_id: z.number(),
    }),
  ),
});

export const GetAllCheckoutSchema = z.object({
  id: z.number(),
  order_id: z.string(),
  name: z.string(),
  phone: z.string(),
  total_price: z.number(),
  total_product: z.number(),
  status_checkout: z.boolean(),
  created_at: z.string(),
});

export const GetDetailCheckout = z.object({
  id: z.number(),
  order_id: z.string(),
  name: z.string(),
  phone: z.string(),
  disc_code: z.string().optional(),
  payment_method: z.enum(["cash", "QRIS"]),
  upload_recipt: z.string().optional(),
  total_price: z.number(),
  total_product: z.number(),
  status_checkout: z.boolean(),
  product_checkout: z.array(
    z.object({
      quantity: z.number(),
      product: ProductSchema.omit({ id: true, stock: true }),
    }),
  ),
  created_at: z.string(),
});

export const UpdateCheckoutStatus = z.object({
  status_checkout: z.boolean(),
});

export type AddCheckoutType = z.infer<typeof AddCheckoutSchema>;
export type GetAllCheckoutType = z.infer<typeof GetAllCheckoutSchema>;
export type GetDetailCheckoutType = z.infer<typeof GetDetailCheckout>;
export type UpdateCheckoutStatusType = z.infer<typeof UpdateCheckoutStatus>;
