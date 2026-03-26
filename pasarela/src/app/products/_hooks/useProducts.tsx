import { productStatus } from "@/common/types/filtersTypes"
import API from "@/lib/api"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

interface Props{
    status: productStatus | null,
    months: number | null,
    page: number,
    query:string
}

export interface PropsExportProducts{
    status: productStatus | null,
    months: number | null,
    page: number,
    query:string,
    extension:string,
    fields:string[]
}

export const useProducts = () =>{
    const router = useRouter();
    const {t} = useTranslation();

    const getProducts = async ({status,months,page,query}:Props) =>{
        try{
            const response = await API.get(`/products`,{
                params:{
                    status,
                    months,
                    page,
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

     const getProductsExport = async ({status,months,query,extension,fields}:PropsExportProducts) =>{
        try{
            const response = await API.get(`/products/export/${extension}`, {
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
        link.setAttribute('download', `${t('export.products_exported')}_${date}.${fileExt}`);
        
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


    const getProductById = async ({id}:{id:string}) =>{
        try{
            const response = await API.get(`/products/${id}`)
            return {success:true,data: response.data}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }

    const deleteProduct = async (id:string) =>{
        try{
             await API.delete(`/products/${id}`)
            return {success:true}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }



    return {getProducts, getProductById, getProductsExport, deleteProduct};
}
