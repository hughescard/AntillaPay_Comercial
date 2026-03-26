import API from "@/lib/api"
import { AxiosError } from "axios";
import { useRouter } from "next/navigation"


interface transferProps{
    paymentId:string
}

type PaymentLinkPdfType = "pay" | "transfer";

type TransferResponse = {
    success: boolean;
    url?: string;
    transferId:string;
}

interface payinProps{
    contactEmail:string,
    contactName:string,
    accountMode:'cuba' | 'foreing',
    paymentId:string
}


export const useOperation = () => {
    const router = useRouter()

    const resolveOperationLink = (payload: unknown) => {
        const responseData = payload as {
            link?: string;
            url?: string;
            iframeLink?: string;
            data?: { link?: string; url?: string; iframeLink?: string };
        };
        return (
            responseData?.link ??
            responseData?.url ??
            responseData?.iframeLink ??
            responseData?.data?.link ??
            responseData?.data?.url ??
            responseData?.data?.iframeLink
        );
    };
    
    const postTransferOfPaymentLink = async (data:transferProps | string): Promise<TransferResponse>=>{
        try{
        const paymentId = typeof data === "string" ? data : data.paymentId;
        const response = await API.post(`/payment-links/pay/${paymentId}/transfer`)
        const url = resolveOperationLink(response?.data);
        return {success:true, url, transferId:response.data.transferId}
        }catch(error){
            console.log(error)
            const axiosError = error as AxiosError;
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            const url = resolveOperationLink(axiosError.response?.data);
            return {success:false, url, transferId:''};
        }   
    }

    const postPayinOfPaymentLink = async (data:payinProps): Promise<TransferResponse>=>{
        try{
            const response = await API.post(`/payment-links/pay/${data.paymentId}/payin`,{
                accountMode: data.accountMode,
                contactEmail: data.contactEmail,
                contactName: data.contactName
                })
            const url = resolveOperationLink(response?.data);
            return {success:true, url, transferId:response.data.transferId}
        }catch(error){
            console.log(error)
            const axiosError = error as AxiosError;
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            const url = resolveOperationLink(axiosError.response?.data);
            return {success:false, url, transferId:''}
        }   
    }

    const getPaymentLinkPdf = async (
        type: PaymentLinkPdfType,
        paymentId: string
    ): Promise<{ success: boolean }> => {
        try {
            const response = await API.get(`/payment-links/${type}/${paymentId}/pdf`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `payment-link-${type}-${paymentId}.pdf`);
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

    return {postTransferOfPaymentLink, postPayinOfPaymentLink, getPaymentLinkPdf}
}
