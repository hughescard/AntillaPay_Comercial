import API from "@/lib/api"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

interface Props{
    search: string | null,
    status: 'Pending' | 'Completed' | 'Rejected' | null,
    months: number | null,
    page: number
}

interface PropsTransfer{
    search: string | null,
    status: 'Pending' | 'Completed' | 'Rejected' | null,
    months: number | null,
    page: number,
    way:'in' | 'out'
}

interface PropsId{
    id:string
}

interface PropsTransactions{
    id:string,
    page:number
}


export interface PropsTransferExports{
    status: 'Pending' | 'Completed' | 'Rejected'| null,
    months: number | null,
    extension:'csv' | 'excel',
    query:string | null,
    fields:string,
    way:'in' | 'out'
}

export interface PropsPayinsExports{
    status: 'Pending' | 'Completed' | 'Rejected'| null,
    months: number | null,
    extension:'csv' | 'excel',
    query:string | null,
    fields:string
}

export const useTransactions = () =>{
    const router = useRouter()
    const {t} = useTranslation();

    const getTransfers = async ({search,status,months,page,way}:PropsTransfer) =>{
        try{
            const response = await API.get(`/transfers/${way}`,{
                params:{
                    query:search,
                    status: status,
                    months: months,
                    page: page,way
                }
            })
            return {success:true,data: response.data.data, pagination: response.data.pagination}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }

    const getPayins = async ({search,status,months,page}:Props) =>{
        try{
            const response = await API.get(`/payins`,{
                params:{
                    query:search,
                    status: status,
                    months: months,
                    page: page,
                }
            })
            return {success:true,data: response.data.data, pagination: response.data.pagination}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }


    const getExportTransfers = async ({status,months,query,extension,fields,way}:PropsTransferExports) =>{
        try{
            const response = await API.get(`/transfers/export/${extension}/${way}`, {
            params: {
                status,   
                months, 
                query,  
                fields  
            },
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
        if(way == 'out'){
            link.setAttribute('download', `${t('export.transfers_exported')}_${date}.${fileExt}`);
        }else{
            link.setAttribute('download', `${t('export.antilla_balance_charges_exported')}_${date}.${fileExt}`);
        }
        
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
    }

    const getExportPayins =  async ({status,months,query,extension,fields}:PropsPayinsExports) =>{
        try{
            const response = await API.get(`/payins/export/${extension}`, {
            params: {
                status,   
                months, 
                query,  
                fields  
            },
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
        link.setAttribute('download', `${t('export.bank_account_charges_exported')}_${date}.${fileExt}`);
        
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
    }

    const createTransfer = async (data:{businessEmail:string,amount:number}) =>{
        try{
            const response = await API.post(`/transfers/`,data)
            return {success:true,data: response.data.data, paginaton:response.data.pagination}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            const responseData = (error as { response?: { data?: unknown } })?.response?.data as
                | {
                    message?: string | string[];
                    error?: string | { message?: string | string[] };
                    code?: string;
                  }
                | string
                | undefined;
            if (typeof responseData === "string") {
                return {success:false, message: responseData}
            }
            const normalizedMessage = Array.isArray(responseData?.message)
                ? responseData.message[0]
                : responseData?.message;
            const normalizedError =
                typeof responseData?.error === "string"
                    ? responseData.error
                    : Array.isArray(responseData?.error?.message)
                        ? responseData.error.message[0]
                        : responseData?.error?.message;
            const message = normalizedMessage ?? normalizedError ?? responseData?.code;
            return {success:false, message}
        }
    }


    return {getTransfers, getPayins ,getExportPayins, getExportTransfers, createTransfer};
}
