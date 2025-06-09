import { useMutation } from "@tanstack/react-query";
import api from "../../axios";

export interface ToDoRequest {
    userId: string;
    itemId: string;
}

export default function usePostDeleteToDoList(){
    return useMutation({
        mutationKey: ["get_todo"],
        mutationFn: async (request: ToDoRequest) => {
            const response = await api.delete<Response>(`/deleteToDos/${request.userId}/${request.itemId}`, {
                withCredentials: true
            })
            return response.data;
        }
    })
}