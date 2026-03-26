import API from "@/lib/api"
import { useRouter } from "next/navigation"

interface Props{
    status:'Completed' | 'Pending' | 'Rejected' | null,
    months:number | null,
    page:number 
}


export const useBalance = () =>{
    const router = useRouter()

    const getBalance = async () =>{
        try{
            const response = await API.get(`/bank-accounts/balance`,{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                }
            })
            return {success:true,data: response.data}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }

    const getPayouts = async ({status,months,page}:Props) =>{
        try{
            const response = await API.get(`/payouts`,{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                params:{
                    status,
                    months,
                    page,
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

    const getBanksAccounts = async () =>{
        try{
            const response = await API.get(`/bank-accounts`,{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                }
            })
            return {success:true,data: response.data}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }

    const postBankAccount = async (data:{bankName:string,accountNumber:string,currency:string,representativeId:string,representativeName:string})=>{
        try{
        await API.post(`/bank-accounts`,data)
        return {success:true}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }  
    }

     const postBankAccountExtract = async (data:{amount:number,accountId:string})=>{
        try{
        await API.post(`/payouts`,{amount:data.amount * 100, bankAccountId:data.accountId})
        return {success:true}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }  
    }



    return {getBalance, getPayouts, getBanksAccounts, postBankAccount, postBankAccountExtract};
}
