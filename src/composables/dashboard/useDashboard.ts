import { createQuery } from "@tanstack/svelte-query";
import type { AxiosError } from "axios";

import { api } from "../../service/api";

import type { ErrorResponse } from "../../types/errors";

import type {
  DashboardResponseType,
  DashboardDataType,
} from "../../types/dashboard";

export const useDashboard = () => {
  const query = createQuery<DashboardDataType, Error>(() => ({
    queryKey: ["dashboard"],

    queryFn: async () => {
      try {
        const res = await api.get<DashboardResponseType>("/get_dashboard");

        return res.data.data;
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;

        throw new Error(
          error.response?.data.message || "Gagal mendapatkan dashboard",
        );
      }
    },
  }));

  return {
    get isLoading() { return query.isLoading; },
    get isError() { return query.isError; },
    get error() { return query.error; },
    get data() { return query.data; },
    refetch: () => query.refetch(),
  };
};
