import { createQuery } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../../types/errors";
import { api } from "../../service/api";
import type { GetDetailCheckoutType } from "../../types/checkout";

export const useOneCheckout = (order: string) => {
  return createQuery<GetDetailCheckoutType, Error>(() => ({
    queryKey: ["checkouts", order],
    queryFn: async () => {
      try {
        const res = await api.post("/get_checkout_detail", {
          p_order_id: order,
        });
        return res.data.data as GetDetailCheckoutType;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        throw new Error(
          error.response?.data.message || "Gagal mendapatkan checkout",
        );
      }
    },
  }));
};
