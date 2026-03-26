import API from "@/lib/api"
import { useRouter } from "next/navigation"

interface step1Data{
  documentationId: string | null; 
  businessType: string;   
}

interface step2Data{
  commercialName: string | null;   
  country: string;
  state: string | null;           
  city: string | null;           
  address: string | null;
  postalCode: string | null;
  website: string | null;
}

interface step3Data{
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  representativeBirthDate: string;
  representativeCountry: string;
  representativeState: string | null;
  representativeCity: string | null;
  representativeAddress: string | null;
  representativePostalCode: string | null;
}

interface step4Data{
  category: string;
  description: string | null;
}

interface step5Data{
  supportPhone: string | null;
  supportEmail: string | null;
  supportCountry: string | null;
  supportState: string | null;
  supportCity: string | null;
  supportAddress: string | null;
  supportPostalCode: string | null;
  showSupportPhone: boolean;
}

export const useUser = () =>{
    const router = useRouter()
    const putUser = async ({data,step}:{data:step1Data | step2Data | step3Data | step4Data | step5Data,step:number}) =>{
        try{
            await API.put(`/businesses/step-${step}`,data)
            return {success:true}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }
    const validateUser = async ()=>{
      try{
            await API.put(`/businesses/validate`)
            return {success:true}
        }catch(error){
            console.log(error)
            if(error == "AxiosError: Request failed with status code 401"){
                router.push('/signin')
            }
            return {success:false}
        }
    }
    
    return{putUser,validateUser}
}