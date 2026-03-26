import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export type ThirdPartyPayment = {
  id: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  bankName: string;
  accountNumber: string;
  reference: string;
  amount: string;
  currency: string;
  status: "Pending" | "Completed" | "Rejected";
  createdAt: string;
};

type ListParams = {
  search: string | null;
  status: "Pending" | "Completed" | "Rejected" | null;
  months: number | null;
  page: number;
};

export type ThirdPartyPaymentsExportParams = {
  status: "Pending" | "Completed" | "Rejected" | null;
  months: number | null;
  extension: "csv" | "excel";
  query: string | null;
  fields: string;
};

type CreatePayload = {
  beneficiaryName: string;
  beneficiaryEmail: string;
  bankName: string;
  accountNumber: string;
  reference: string;
  amount: number;
};

export const useThirdPartyPayments = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const getThirdPartyPayments = async ({
    search,
    status,
    months,
    page,
  }: ListParams) => {
    try {
      const response = await API.get("/third-party-payments", {
        params: {
          query: search,
          status,
          months,
          page,
        },
      });
      return {
        success: true,
        data: response.data.data as ThirdPartyPayment[],
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.log(error);
      if (error == "AxiosError: Request failed with status code 401") {
        router.push("/signin");
      }
      return { success: false, data: [] as ThirdPartyPayment[] };
    }
  };

  const getExportThirdPartyPayments = async ({
    status,
    months,
    query,
    extension,
    fields,
  }: ThirdPartyPaymentsExportParams) => {
    try {
      const response = await API.get(`/third-party-payments/export/${extension}`, {
        params: {
          status,
          months,
          query,
          fields,
        },
        responseType: "blob",
      });

      const isExcel = extension === "excel";
      const mimeType = isExcel
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";
      const fileExt = isExcel ? "xlsx" : "csv";

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().split("T")[0];
      link.setAttribute(
        "download",
        `${t("export.payments_exported")}_${date}.${fileExt}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.log(error);
      if (error == "AxiosError: Request failed with status code 401") {
        router.push("/signin");
      }
      return { success: false };
    }
  };

  const createThirdPartyPayment = async (data: CreatePayload) => {
    try {
      const response = await API.post("/third-party-payments", data);
      return { success: true, data: response.data };
    } catch (error) {
      console.log(error);
      if (error == "AxiosError: Request failed with status code 401") {
        router.push("/signin");
      }
      const responseData = (error as { response?: { data?: unknown } })?.response?.data as
        | { message?: string | string[] }
        | string
        | undefined;
      const normalizedMessage =
        responseData && typeof responseData === "object" && "message" in responseData
          ? responseData.message
          : undefined;
      const message = Array.isArray(normalizedMessage)
        ? normalizedMessage[0]
        : typeof responseData === "string"
          ? responseData
          : normalizedMessage;
      return { success: false, message };
    }
  };

  return {
    getThirdPartyPayments,
    getExportThirdPartyPayments,
    createThirdPartyPayment,
  };
};
