import { useQuery } from "@tanstack/react-query";
import api from "../axios";

interface MaterialDetail {
    materialName: string,
    description: string,
    grade: string,
    topics: string[],
    difficulty: string;
}

export default function useGetMaterialDetailUser(materialName: string) {
    return useQuery({
        queryKey: ["material_detail_user", materialName],
        queryFn: () => {
            const response = api.get<BaseResponse<MaterialDetail>>("/getMaterialDetail", {
                params: { materialName },
                withCredentials: true,
            })
            return response;
        }
    })
}