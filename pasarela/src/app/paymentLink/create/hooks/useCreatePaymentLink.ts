import { useCallback, useState } from "react";
import API from "@/lib/api";
import { PaymentDataCreate } from "../types";
import { useRouter } from "next/navigation";

type UseCreatePaymentLinkOptions = {
  endpoint?: string;
};

type ErrorResponse = {
  data?: {
    status: number;
  };
};

export const useCreatePaymentLink = (
  options: UseCreatePaymentLinkOptions = {}
) => {
  const { endpoint = "/payment-links" } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createPaymentLink = useCallback(
    async (payload: PaymentDataCreate) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await API.post(endpoint, payload);
        return response.data;
      } catch (err) {
        setError("Failed to create payment link.");
        if ((err as ErrorResponse).data?.status === 401) {
          router.push('/signin')
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint]
  );

  return { createPaymentLink, isLoading, error };
};
