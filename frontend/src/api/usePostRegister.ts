import { useMutation } from "@tanstack/react-query";
import api from "./axios";

export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    role: string;
}

export interface Response {
  body: {
    code: number
    data: {
      id: string | null
      role: string
    }
    message: string
    status: string
  }
}

export default function usePostRegister() {
    return useMutation({
      mutationKey: ["user_register"],
      mutationFn: async (request: RegistrationRequest) => {
        const response = await api.post<Response>("/register", request, {
          withCredentials: true,
        });
        return response.data;
      },
    });
}