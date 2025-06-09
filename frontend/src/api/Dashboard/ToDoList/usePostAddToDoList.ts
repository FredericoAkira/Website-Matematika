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

export default function usePostAddToDoList(){
    return useMutation({
        mutationKey: ["add_todo"],
        mutationFn: async (request: ToDoRequest) => {
            const response = await api.post<Response>("/addToDos", request, {
                withCredentials: true
            })
            return response.data;
        }
    })
}