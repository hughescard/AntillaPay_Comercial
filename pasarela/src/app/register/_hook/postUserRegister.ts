import API from "@/lib/api"

interface Props {
    email:string,
    password:string,
    country:string
}

export const postUserRegister = async (data:Props) =>{
    try{
        const response = await API.post(`/auth/register`,data,{})
        return {success:true ,data: response.data}
    }catch(error: unknown){
        console.log(error)
        if (error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data) {
            return {success:false ,data: (error.response as { data: { message: string } }).data.message }
        }
        return {success:false ,data: "unknown_error" }
    }
}