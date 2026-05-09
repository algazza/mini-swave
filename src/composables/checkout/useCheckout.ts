import { createQuery } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../../types/errors";
import { api } from "../../service/api";
import type { GetAllCheckoutType } from "../../types/checkout";

export const useCheckout = () => {
  return createQuery<GetAllCheckoutType[], Error>(() => ({
    queryKey: ["checkouts"],
    queryFn: async () => {
      try {
        const res = await api.get("/get_all_checkout");
        return res.data.data as GetAllCheckoutType[];
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        throw new Error(
          error.response?.data.message || "Gagal mendapatkan checkout",
        );
      }
    },
  }));
};
