import { useNavigate } from "react-router-dom";
import api from "./axios";


export interface Response {
  body: {
    code: number
    data: string
    message: string
    status: string
  }
}

export const usePostLogout = () => {
    const navigate = useNavigate();
    function logout() {
        navigate("/", {replace: true})
        api.post<Response>("/userLogout");
        localStorage.removeItem("user")
    }

    return {
        logout
    }
}