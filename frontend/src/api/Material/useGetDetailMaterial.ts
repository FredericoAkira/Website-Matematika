import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface MaterialDetail {
    materialId: string,
    materialName: string,
    description: string,
    backgroundImg: string,
    grade: string,
    topics: {
        id: string;
        name: string;
    }[],
    quizzes: {
        id: string;
        name: string;
    }[],
    difficulty: string;
}

export default function useGetMaterialDetail(materialName: string) {
    return useQuery({
        queryKey: ["material_detail", materialName],
        queryFn: () => {
            const response = api.get<BaseResponse<MaterialDetail>>("/admin/getMaterialDetail", {
                params: { materialName },
                withCredentials: true,
            })
            return response;
        }
    })
}