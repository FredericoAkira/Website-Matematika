import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface content {
    name: string;
    id: string;
    description: string;
    parent: string;
}

export interface PaginationResponse {
    code: number,
    status: string,
    message: string,
    data: {
        content: content[],
        pageable: {
            pageNumber: number,
            pageSize: number,
            sort: {
                unsorted: boolean,
                empty: boolean,
                sorted: boolean
            },
            offset: number,
            paged: boolean,
            unpaged: boolean
        },
        totalPages: number,
        totalElements: number,
        last: boolean,
        size: number,
        number: number,
        sort: {
            unsorted: boolean,
            empty: boolean,
            sorted: boolean
        },
        numberOfElements: number,
        first: boolean,
        empty: boolean
    }
}

export default function useGetTopicList(page: number, size: number, materialName: string, search: string) {
    return useQuery({
      queryKey: ["topic_list", page, size, materialName, search],
      queryFn: async () => {
        const response = await api.get<PaginationResponse>(`/admin/getTopic`, {
          params: { page, size, materialName, search },
          withCredentials: true,
        });
        return response.data;
      },
      keepPreviousData: true,
      retry: false
    });
}