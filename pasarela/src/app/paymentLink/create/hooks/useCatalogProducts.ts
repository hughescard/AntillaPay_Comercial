import { useCallback, useEffect, useState } from "react";
import API from "@/lib/api";
import type { CatalogProduct } from "../types";

type CatalogResponse = CatalogProduct[] | { data: CatalogProduct[] };

type UseCatalogProductsOptions = {
  endpoint?: string;
  initialProducts?: CatalogProduct[];
};

const normalizeCatalog = (payload: CatalogResponse) => {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
};

export const useCatalogProducts = (options: UseCatalogProductsOptions = {}) => {
  const { endpoint = "/products", initialProducts = [] } = options;
  const [products, setProducts] = useState<CatalogProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.get<CatalogResponse>(endpoint);
      setProducts(normalizeCatalog(response.data));
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    setProducts,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};
