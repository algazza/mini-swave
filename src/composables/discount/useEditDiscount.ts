import { createMutation, useQueryClient } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";
import type { DiscountEditType } from "../../types/discount";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

type EditDiscountPayload = DiscountEditType & {
  old_disc_code: string;
};

export const useEditDiscount = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (payload: EditDiscountPayload) => {
      try {
        const { old_disc_code, disc_code, percentage } = payload;

        const res = await api.post("/edit_discount", {
          p_old_disc_code: old_disc_code,

          p_new_disc_code: disc_code,

          p_percentage: percentage,
        });

        return res.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        throw new Error(error.response?.data.message || "Gagal edit discount");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discounts"],
      });
    },
  }));
};
