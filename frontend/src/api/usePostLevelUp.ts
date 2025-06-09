import { useMutation } from "@tanstack/react-query";
import api from "./axios";

export interface LevelUpReq {
    userId: string;
    totalProgress: number;
    levelCap: number;
    currentLevel: string;
}

export interface LevelResponse {
    data: {
        newLevel: string
        message: string
        levelChanged: boolean
    }
}

export default function usePostLevelUp() {
    return useMutation({
        mutationKey: ["level_Up"],
        mutationFn: async (request: LevelUpReq) => {
            const response = await api.post<LevelResponse>("/levelUp", request, {
                withCredentials: true
            });
            return response.data;
        }
    })
}