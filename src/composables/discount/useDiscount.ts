import { createQuery } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../../types/errors";
import { api } from "../../service/api";
import type { DiscountType } from "../../types/discount";

export const useDiscount = () => {
  return createQuery<DiscountType[], Error>(() => ({
    queryKey: ["discounts"],
    queryFn: async () => {
      try {
        const res = await api.get("/get_all_discount");
        return res.data.data as DiscountType[];
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        throw new Error(
          error.response?.data.message || "Gagal mendapatkan discount",
        );
      }
    },
  }));
};
