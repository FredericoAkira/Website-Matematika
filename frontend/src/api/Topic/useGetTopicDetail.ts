import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export interface TopicDetail {
    topicContent: {
        explanation: string,
        audio: string,
        image: string,
        text: string,
        video: string
    }[]
    topicId: string
}

export default function useGetTopicDetail(topicName: string) {
  return useQuery({
    queryKey: ["topic_detail", topicName],
    queryFn: () => {
      const response = api.get<BaseResponse<TopicDetail>>(`/admin/getTopicDetail`, {
        params: { topicName },
        withCredentials: true,
      });
      return response;
    },
    retry: false,
  });
}
