import { useMutation } from "@tanstack/react-query";
import api from "../../axios";

export interface ToDoRequest {
    userId: string;
    toDoItem: {
        itemId: string;
        text: string;
        completed: boolean;
    }
}

export default function usePostEditToDoList(){
    return useMutation({
        mutationKey: ["edit_todo"],
        mutationFn: async (request: ToDoRequest) => {
            const response = await api.put<Response>("/editToDos", request, {
                withCredentials: true
            })
            return response.data;
        }
    })
}