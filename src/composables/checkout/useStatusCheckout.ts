import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import type { AxiosError } from "axios";
import type { UpdateCheckoutStatusType } from "../../types/checkout";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

type UpdateCheckoutPayload = UpdateCheckoutStatusType & {
  order_id: string;
};

export const useUpdateCheckoutStatus = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (payload: UpdateCheckoutPayload) => {
      try {
        const { order_id, status_checkout } = payload;

        const res = await api.post("/update_status_checkout", {
          p_order_id: order_id,
          p_status: status_checkout,
        });

        return res.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        throw new Error(
          error.response?.data.message || "Gagal update status checkout",
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkouts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  }));
};
