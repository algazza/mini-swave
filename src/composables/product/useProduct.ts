import { createQuery } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../../types/errors";
import { api } from "../../service/api";
import type { ProductType } from "../../types/product";

export const useProduct = () => {
  return createQuery<ProductType[], Error>(() => ({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await api.get("/get_all_product");
        return res.data.data as ProductType[];
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        throw new Error(
          error.response?.data.message || "Gagal mendapatkan produk",
        );
      }
    },
  }));
};