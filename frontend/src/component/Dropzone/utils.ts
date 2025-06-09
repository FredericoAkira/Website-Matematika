export const isImage = (file: File) => file.type.includes("image/");

export const isPDF = (file: File) => file.type.includes("/pdf");

export function parseErrorCode(code: string): string {
  switch (code) {
    case "file-invalid-type":
      return "The file type is not supported by the accepted types.";
    case "file-too-large":
      return "The file size is larger than the maximum size.";
    default:
      return "File can't be processed.";
  }
}
