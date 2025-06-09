import { useQuery } from "@tanstack/react-query";
import api from "../../axios";

export interface ToDoDetail {
    userId: string;
    todoItems: {
        itemId: string;
        text: string;
        completed: boolean;
    }[]
}

export default function useGetToDoList(userId: string){
    return useQuery({
        queryKey: ["get_todo", userId],
        queryFn: async () => {
            const response = await api.get<BaseResponse<ToDoDetail>>("/getToDoList", {
                params: { userId },
                withCredentials: true
            })
            return response.data;
        }
    })
}