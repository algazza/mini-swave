import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import type { AxiosError } from "axios";
import type { ProductEditType } from "../../types/product";
import { supabase } from "../../lib/supabase";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

type AddProductPayload = ProductEditType & {
  image: File;
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (payload: AddProductPayload) => {
      try {
        const { name, stock, price, image } = payload;

        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, image, {
            contentType: "image/*",
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData.publicUrl;
        const res = await api.post("/add_product", {
          p_name: name,
          p_stock: stock,
          p_price: price,
          p_image: imageUrl,
        });

        return res.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        throw new Error(
          error.response?.data.message || "Gagal menambahkan product",
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
