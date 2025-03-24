import * as axios from "axios";
export const fileUploadURL = "http://localhost:8080/file-management/upload"
export const client = axios.default.create(
    {
        baseURL: "http://localhost:8080"
    }
)
export async function request(url:string,data:any){
   return await client.post(url, data)
}