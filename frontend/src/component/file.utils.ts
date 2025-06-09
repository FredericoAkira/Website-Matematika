import axios from "../api/axios";
import { MimetypeExpression } from "./helper";

type Attachment = {
  attachment: string;
  createdDate?: Date;
  fileName: string;
  mimetype?: string;
  id?: number;
  lastModified?: Date;
};

export const FileSizeConversions = {
  convert: (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";

    const size = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round(bytes / Math.pow(1024, size)) + sizes[size];
  },

  base64ToFileDownload: (base64String: string, fileName: string) => {
    try {
      // Decode Base64 string
      const binaryString = atob(base64String);

      // Convert binary string to ArrayBuffer
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      // Create Blob from array buffer
      const blob = new Blob([uint8Array], { type: "application/octet-stream" });

      // Create object URL for the blob
      const url = URL.createObjectURL(blob);

      // Create an anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // Append link to the document
      document.body.appendChild(link);

      // Trigger the click event
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      // Revoke the object URL to free up resources
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error in base64ToFile:", error);
    }
  },
  base64ToFile: (base64String: string) => {
    try {
      // Decode Base64 string
      const binaryString = atob(base64String);

      // Convert binary string to ArrayBuffer
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      // Create Blob from array buffer
      const blob = new Blob([uint8Array], { type: "application/octet-stream" });
      return blob as File;
    } catch (error) {
      console.error("Error in base64ToFile:", error);
    }
  },

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Unable to read file as Base64."));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  },
};

export const FileTypeParser = {
  lookup: (base64: string): string | undefined => {
    const startsWith = (char: string) => base64.startsWith(char);

    if (startsWith("/9j/")) return MimetypeExpression[".jpeg,.jpg"];
    if (startsWith("JVBERi0")) return MimetypeExpression[".pdf"];
    if (startsWith("iVBORw0KGgo")) return MimetypeExpression[".png"];

    return undefined;
  },
};

export const FileDecoder = {
  fromBase64Attachment(
    attachments: Attachment | Attachment[] | null,
  ): File[] | undefined {
    if (!attachments) return undefined;
    if (Array.isArray(attachments)) {
      return attachments.map((attachment) => {
        const { attachment: base64, mimetype } = attachment;
        let { fileName } = attachment;

        const type = mimetype || FileTypeParser.lookup(base64);
        const decoded = atob(base64);

        for (const ext in MimetypeExpression) {
          const prop = ext as keyof typeof MimetypeExpression;
          if (MimetypeExpression[prop] === type) {
            fileName += ext;
          }
        }

        const data = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
          data[i] = decoded.charCodeAt(i);
        }

        const file = new File([data], fileName, { type });
        (file as { preview?: string }).preview =
          `data:${type};base64,${base64}`;

        return file;
      });
    } else {
      const { attachment: base64, mimetype } = attachments;
      let { fileName } = attachments;

      const type = mimetype || FileTypeParser.lookup(base64);
      const decoded = atob(base64);

      for (const ext in MimetypeExpression) {
        const prop = ext as keyof typeof MimetypeExpression;
        if (MimetypeExpression[prop] === type) {
          fileName += ext;
        }
      }

      const data = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        data[i] = decoded.charCodeAt(i);
      }

      const file = new File([data], fileName, { type });
      (file as { preview?: string }).preview = `data:${type};base64,${base64}`;

      return [file];
    }
  },
  async toBase64(file: File): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const base64string = event.target.result as string;
          resolve(base64string);
        }
      };

      reader.readAsDataURL(file);
    });
  },
};

export const FileDownloader = {
  fromFileObject(file: File) {
    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.name;

    link.click();
    URL.revokeObjectURL(fileUrl);
  },
};

export const base64ToFileWithFileName = (
  base64String: string,
  fileName: string,
) => {
  const base64Data = base64String.includes("base64,")
    ? base64String.split("base64,")[1]
    : base64String;

  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset++) {
    byteArrays.push(byteCharacters.charCodeAt(offset));
  }

  const byteArray = new Uint8Array(byteArrays);
  return new File([byteArray], fileName, { type: "application/pdf" }); // Set the correct MIME type here
};

export const fetchFileInfo = async (
  fileUrl: string,
  method?: string,
  customFileName?: string,
) => {
  try {
    const resp = await axios(fileUrl, {
      responseType: "blob",
      method: method ?? "GET",
    });

    const splittedFilePath = fileUrl.split("/");
    const default_filename = splittedFilePath[splittedFilePath.length - 1];

    const contentType = resp.headers["content-type"];
    const contentDisposition = resp.headers["Content-Disposition"];

    const fileName = customFileName
      ? customFileName
      : contentDisposition && contentDisposition?.match(/filename="([^"]+)"/)
        ? contentDisposition?.match(/filename="([^"]+)"/)[1]
        : default_filename;

    const file = new File([resp.data], fileName, {
      type: contentType,
    });

    return {
      fileName,
      file,
      isError: false,
    };
  } catch (error) {
    return {
      fileName: error,
      file: null,
      isError: true,
    };
  }
};
