import { useCallback, useState } from "react";
import API from "@/lib/api";
import type { CatalogProduct, CatalogProductCreate } from "../types";

type UseCreateProductOptions = {
  endpoint?: string;
};

const buildProductFormData = (payload: CatalogProductCreate) => {
  const data = new FormData();
  data.append("name", payload.name);
  data.append("description", payload.description ?? "");
  data.append("prices", JSON.stringify(payload.prices));
  data.append("status", payload.status);
  if (payload.imageFile) {
    data.append("image", payload.imageFile);
  }
  return data;
};

export const useCreateProduct = (options: UseCreateProductOptions = {}) => {
  const { endpoint = "/products" } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = useCallback(
    async (payload: CatalogProductCreate) => {
      setIsLoading(true);
      setError(null);

      try {
        const { imageFile, ...rest } = payload;
        const data = imageFile ? buildProductFormData(payload) : rest;
        const response = await API.post<CatalogProduct>(endpoint, data);
        return response.data;
      } catch (err) {
        setError("Failed to create product.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint]
  );

  return { createProduct, isLoading, error };
};
