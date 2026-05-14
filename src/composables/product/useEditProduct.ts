import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import type { AxiosError } from "axios";
import type { ProductEditType } from "../../types/product";
import { supabase } from "../../lib/supabase";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

type EditProductPayload = ProductEditType & {
  id: number;
  image?: File | null;
  oldImage?: string;
};

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (payload: EditProductPayload) => {
      try {
        const { id, name, stock, price, image, oldImage } = payload;

        let imageUrl = oldImage || "";
        if (image) {
          const fileExt = image.name.split(".").pop();

          const fileName = `${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(fileName, image);

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          const { data: publicUrlData } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

          imageUrl = publicUrlData.publicUrl;

          if (oldImage) {
            const oldFileName = oldImage.split("/").pop();

            if (oldFileName) {
              await supabase.storage
                .from("products")
                .remove([oldFileName]);
            }
          }
        }

        const res = await api.post("/edit_product", {
          p_id: id,
          p_name: name,
          p_stock: stock,
          p_price: price,
          p_image: imageUrl,
        });

        return res.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        throw new Error(error.response?.data.message || "Gagal edit product");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  }));
};
