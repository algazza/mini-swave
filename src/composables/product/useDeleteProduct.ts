import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import type { AxiosError } from "axios";
import { supabase } from "../../lib/supabase";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

type DeleteProductPayload = {
  id: number;
  imageUrl?: string;
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (payload: DeleteProductPayload) => {
      try {
        const { id, imageUrl } = payload;
        if (imageUrl) {
          const fileName = imageUrl.split("/").pop();

          if (fileName) {
            await supabase.storage.from("product-image").remove([fileName]);
          }
        }

        const res = await api.post("/delete_product", {
          p_id: id,
        });

        return res.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        throw new Error(
          error.response?.data.message || "Gagal menghapus product",
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  }));
};
