import { z } from "zod";

export const TopProductSchema = z.object({
  name: z.string(),
  product_image: z.string().url(),
  total_sold: z.number(),
});

export const DashboardRevenueSchema = z.object({
  cash: z.number(),
  cashless: z.number(),
  total: z.number(),
});

export const DashboardOrdersSchema = z.object({
  total: z.number(),
  success: z.number(),
  pending: z.number(),
});

export const DashboardProductsSchema = z.object({
  total_product: z.number(),
  total_stock: z.number(),
});

export const DashboardDataSchema = z.object({
  revenue: DashboardRevenueSchema,
  orders: DashboardOrdersSchema,
  products: DashboardProductsSchema,
  top_products: z.array(TopProductSchema),
});

export const DashboardResponseSchema = z.object({
  status: z.literal("success"),
  data: DashboardDataSchema,
});

export type TopProductType = z.infer<typeof TopProductSchema>;

export type DashboardRevenueType = z.infer<typeof DashboardRevenueSchema>;

export type DashboardOrdersType = z.infer<typeof DashboardOrdersSchema>;

export type DashboardProductsType = z.infer<typeof DashboardProductsSchema>;

export type DashboardDataType = z.infer<typeof DashboardDataSchema>;

export type DashboardResponseType = z.infer<typeof DashboardResponseSchema>;
