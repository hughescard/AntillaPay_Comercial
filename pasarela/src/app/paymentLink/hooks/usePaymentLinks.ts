import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { paymentLinkStatus } from "@/common/types/filtersTypes";
import { useTranslation } from "react-i18next"


export type PaymentLinkListItem = {
  id: string;
  title?: string | null;
  description?: string | null;
  currency?: string | null;
  totalAmount?: number | null;
  status?: paymentLinkStatus | string | null;
  createdAt?: string | null;
  products?: Array<{ id: string; quantity?: number }> | null;
  link:string;
};

type PaymentLinksResponse =
  | { data?: PaymentLinkListItem[]; pagination?: { total: number; pages: number; page: number, limit: number } }
  | PaymentLinkListItem[];

type PaymentLinksParams = {
  status: paymentLinkStatus | null;
  months: number | null;
  page: number;
  query: string;
};

type EditTitleParams = {
  id: string;
  title: string;
};

export type PaymentLinksExport ={
  months: number | null,
  query:string | null,
  extension:'csv' | 'excel',
  fields:string
}

export const usePaymentLinks = () => {
  const router = useRouter();
  const {t} = useTranslation();

  const getPaymentLinks = async ({ status, months, page, query }: PaymentLinksParams) => {
    try {
      const response = await API.get<PaymentLinksResponse>("/payment-links", {
        params: { status, months, page, query },
      });

      const payload = response.data;
      const data = Array.isArray(payload) ? payload : payload?.data ?? [];
      const pagination = Array.isArray(payload) ? undefined : payload?.pagination;

      return { success: true, data, pagination };
    } catch (error) {
      if (error == "AxiosError: Request failed with status code 401") {
        router.push("/signin");
      }
      return { success: false, data: [], pagination: undefined };
    }
  };

  const getPaymentLinksExport = async ({months,query,extension,fields}:PaymentLinksExport) =>{
    try{
      const response = await API.get(`/payment-links/export/${extension}`, {
        params: { months, query, fields },
        responseType: 'blob' 
      });

      const isExcel = extension === 'excel';
      const mimeType = isExcel 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        : 'text/csv';
      const fileExt = isExcel ? 'xlsx' : 'csv';
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `${t('export.payments_exported')}_${date}.${fileExt}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    }catch(error){
      console.log(error)
      if(error == "AxiosError: Request failed with status code 401"){
        router.push('/signin')
      }
      return {success:false}
    }
  };

  const editTitle = async ({ id, title }: EditTitleParams) => {
    try {
      await API.put(`/payment-links/${id}`, { title });
      return { success: true };
    } catch (error) {
      if (error == "AxiosError: Request failed with status code 401") {
        router.push("/signin");
      }
      return { success: false };
    }
  };

  return { getPaymentLinks, getPaymentLinksExport, editTitle };
};
