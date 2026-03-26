import API from "@/lib/api"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

interface Props{
    type: 'customer' | 'business' | null,
    months: number | null,
    page: number,
    query:string
}

interface PropsId{
    id:string
}

interface PropsTransactions{
    id:string,
    page:number
}

interface PropsExportOperations{
    type:'csv' | 'excel',
    id:string
}

export interface PropsCustomersExports{
    type: 'customer' | 'business' | null,
    months: number | null,
    extension:'csv' | 'excel',
    query:string | null,
    fields:string
}

export const useCustomers = () =>{
    const router = useRouter()
    const {t} = useTranslation();

    const getCustomers = async ({type,months,page,query}:Props) =>{
        try{
            const response = await API.get(`/customers`,{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                params:{
                    type: type,
                    months: months,
                    page: page,
                    query
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

     const getCustomersExport = async ({type,months,query,extension,fields}:PropsCustomersExports) =>{
        try{
            const response = await API.get(`/customers/export/${extension}`, {
            params: {
                type,   
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
        link.setAttribute('download', `${t('export.clients_exported')}_${date}.${fileExt}`);
        
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

    const getExportOperations = async ({ type, id }: PropsExportOperations) => {
    try {
        const response = await API.get(`/customers/${id}/history/export/${type}`, {
            responseType: 'blob', 
        });

        const blob = new Blob([response.data], { 
            type: type === 'excel' 
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                : 'text/csv' 
        });
        
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        
        const date = new Date().toISOString().split('T')[0];
        const extension = type === 'excel' ? 'xlsx' : 'csv';
        link.setAttribute('download', `${t('export.client_history')}_${id}_${date}.${extension}`);
        
        document.body.appendChild(link);
        link.click();
        
        link.parentNode?.removeChild(link); 
        window.URL.revokeObjectURL(url);

        return { success: true };

    } catch (error) {
        console.log(error);
        
       if(error == "AxiosError: Request failed with status code 401"){
            router.push('/signin');
        }
        
        return { success: false };
    }
}


    const getCustomerById = async ({id}:PropsId) =>{
        try{
            const response = await API.get(`/customers/${id}`)
            return {success:true,data: response.data}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }

    const getOperationsById = async ({id,page}:PropsTransactions) =>{
        try{
            const response = await API.get(`/customers/${id}/history`,{
                params:{
                    page:page
                }
            })
            return {success:true,data: response.data.data, paginaton:response.data.pagination}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }


    return {getCustomerById,getCustomers,getOperationsById, getExportOperations,getCustomersExport};
}
