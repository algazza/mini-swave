import { createMutation, useQueryClient } from "@tanstack/svelte-query";

import type { AxiosError } from "axios";
import type { AddCheckoutType } from "../../types/checkout";
import { supabase } from "../../lib/supabase";
import { api } from "../../service/api";
import type { ErrorResponse } from "../../types/errors";

type AddCheckoutPayload = Omit<AddCheckoutType, "upload_recipt"> & {
  receipt?: File | null;
};

type AddCheckoutResponse = {
  status: "success" | "error";
  message: string;
  order_id: string | null;
};

export const useAddCheckout = () => {
  const queryClient = useQueryClient();

  return createMutation<AddCheckoutResponse, Error, AddCheckoutPayload>(
    () => ({
      mutationFn: async (payload) => {
        try {
          const { receipt, ...checkoutData } = payload;

          let receiptUrl = "";

          if (receipt) {
            const fileExt = receipt.name.split(".").pop();

            const fileName = `receipt-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("receipt_image")
              .upload(fileName, receipt);

            if (uploadError) {
              throw new Error(uploadError.message);
            }

            const { data: publicUrlData } = supabase.storage
              .from("receipt_image")
              .getPublicUrl(fileName);

            receiptUrl = publicUrlData.publicUrl;
          }

          const finalPayload = {
            ...checkoutData,
            upload_recipt: receiptUrl || null,
          };

          const res = await api.post<AddCheckoutResponse>(
            "/add_checkout",
            {
              p_data: finalPayload,
            }
          );

          return res.data;
        } catch (err) {
          const error = err as AxiosError<ErrorResponse>;

          throw new Error(
            error.response?.data.message || "Gagal checkout"
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
    })
  );
};