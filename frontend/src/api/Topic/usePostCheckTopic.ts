import { useMutation } from "@tanstack/react-query";
import api from "../axios";

export interface UploadRequest {
  filename: string;
  fileType: string;
}

export interface SignedUploadResponse {
  alreadyUploaded: boolean;
  fileUrl?: string;
  uploadData?: {
    api_key: string;
    timestamp: number;
    signature: string;
    public_id: string;
    cloud_name: string;
  };
}

export interface CompleteUploadRequest {
  fileHash: string;
  fileUrl: string;
}

/**
 * Hook to upload a file via your backend + Cloudinary.
 * Returns the file URL on success.
 */
export default function usePostCheckTopic() {
  return useMutation<string, Error, File>(async (file: File) => {
    // 1. Request signed params and check existence
    const { data: signData } = await api.post<SignedUploadResponse>(
      "/api/upload/sign",
      { filename: file.name, fileType: file.type },
      { headers: { "Content-Type": "application/json" } }
    );

    if (signData.alreadyUploaded) {
      return signData.fileUrl!;
    }

    // 2. Upload to Cloudinary
    const { api_key, timestamp, signature, public_id, cloud_name } = signData.uploadData!;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("public_id", public_id);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
      { method: "POST", body: formData }
    );
    if (!cloudRes.ok) throw new Error("Cloudinary upload failed");
    const cloudData = await cloudRes.json();
    const fileUrl: string = cloudData.secure_url;

    // 3. Notify backend of completed upload
    const fileHash = public_id.replace("uploads/", "");
    await api.post<unknown>(
      "/api/upload/complete-upload",
      { fileHash, fileUrl },
      { headers: { "Content-Type": "application/json" } }
    );

    return fileUrl;
  });
}
