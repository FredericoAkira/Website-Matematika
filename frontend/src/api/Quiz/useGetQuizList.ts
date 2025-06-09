import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface content {
    id: string;
    materialName: string[];
    quizName: string;
    difficulty: string;
    grade: string;
    totalContent: string;
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

export default function useGetQuizList(
    page: number,
    size: number,
    userId: string,
    materialName: string,
    filterDifficulty: string,
    filterGrade: string,
    searchQuery: string,) {
    return useQuery({
      queryKey: ["quiz_list", page, size, userId, materialName, filterDifficulty, filterGrade, searchQuery],
      queryFn: async () => {
        const response = await api.get<PaginationResponse>(`/admin/getQuiz`, {
          params: { page, size, userId, materialName, filterDifficulty, filterGrade, searchQuery },
          withCredentials: true,
        });
        return response.data;
      },
      keepPreviousData: true,
      retry: false
    });
}