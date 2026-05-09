import { createMutation, useQueryClient } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";
import type { DiscountEditType } from "../../types/discount";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

export const useAddDiscount = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (payload: Omit<DiscountEditType, "id">) => {
      try {
        const { disc_code, percentage } = payload;

        const res = await api.post("/add_discount", {
          p_disc_code: disc_code,
          p_percentage: percentage,
        });

        return res.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        throw new Error(
          error.response?.data.message || "Gagal menambahkan discount",
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discounts"],
      });
    },
  }));
};
