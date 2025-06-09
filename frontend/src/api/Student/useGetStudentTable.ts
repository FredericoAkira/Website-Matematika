import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface content {
    studentId: string;
    studentName: string;
    grade: string;
    latestMaterial: string;
    latestQuiz: string;
    level: string;
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

export default function useGetStudentList(
    page: number,
    size: number,
    teacherId: string,
    filterLevel: string,
    filterGrade: string,
    searchQuery: string,) {
    return useQuery({
      queryKey: ["quiz_list", page, size, teacherId, filterLevel, filterGrade, searchQuery],
      queryFn: async () => {
        const response = await api.get<PaginationResponse>(`/getStudentList`, {
          params: { page, size, teacherId, filterLevel, filterGrade, searchQuery },
          withCredentials: true,
        });
        return response.data;
      },
      keepPreviousData: true,
      retry: false
    });
}