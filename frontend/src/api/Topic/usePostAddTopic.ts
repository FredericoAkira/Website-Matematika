import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface AddTopicRequest {
    userId: string;
    topic: {
        topicName: string;
        topicContent: {
            text: string | null;
            image: string | null;
            audio: string | null;
            video: string | null;
        }[]
    }
}

export default function usePostAddTopic() {
    return useMutation({
        mutationKey: ["add_Topic"],
        mutationFn: async (request: AddTopicRequest) => {
            const response = await api.post<Response>("/admin/addTopic", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}