import { createMutation, useQueryClient } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

type DeleteDiscountPayload = {
  disc_code: string;
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (payload: DeleteDiscountPayload) => {
      try {
        const res = await api.post("/delete_discount", {
          p_disc_code: payload.disc_code,
        });

        return res.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        throw new Error(
          error.response?.data.message || "Gagal menghapus discount",
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
