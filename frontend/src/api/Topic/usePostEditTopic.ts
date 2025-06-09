import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface EditTopicRequest {
    topicId: string | null;
    topicName: string | null;
    topicContent: {
        text: string | null;
        image: string | null;
        audio: string | null;
        video: string | null;
    }[]
}

export default function usePostEditTopic() {
    return useMutation({
        mutationKey: ["edit_Topic"],
        mutationFn: async (request: EditTopicRequest) => {
            const response = await api.put<Response>("/admin/editTopic", request, {
                withCredentials: true
            })
            return response.data
        }
    })
}