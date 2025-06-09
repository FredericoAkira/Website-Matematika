import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface content {
    materialId: string;
    materialName: string;
    grade: string;
    topics: string[];
    quizzes: string[];
    difficulty: string;
    description?: string;
    hasQuiz?: boolean;
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

export default function useGetMaterialList(page: number, size: number, userId: string, gradeFilter: string, searchQuery: string, difficultyFilter?:string, content?:string) {
    return useQuery({
      queryKey: ["material_list", page, size, gradeFilter, searchQuery, userId, difficultyFilter, content],
      queryFn: async () => {
        const response = await api.get<PaginationResponse>(`/getMaterial`, {
          params: { page, size, userId, gradeFilter, difficultyFilter, searchQuery,content },
          withCredentials: true,
        });
        return response.data;
      },
      keepPreviousData: true,
      retry: false
    });
}