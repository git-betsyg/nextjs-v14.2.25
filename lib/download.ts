import { AxiosResponse } from "axios";
import { toast } from "sonner";

/**
 * Parse filename from Content-Disposition header
 * Supports the following formats:
 * - filename*=UTF-8''encoded-filename.ext
 * - filename="filename.ext"
 * - filename=filename.ext
 */
const parseFilename = (contentDisposition: string | undefined): string => {
  if (!contentDisposition) return "download";

  // Prefer matching filename*=UTF-8''xxx (RFC 5987 encoded format)
  const filenameStarMatch = contentDisposition.match(
    /filename\*\s*=\s*(?:UTF-8|utf-8)?''(.+?)(?:;|$)/
  );
  if (filenameStarMatch?.[1]) {
    return decodeURIComponent(filenameStarMatch[1].trim());
  }

  // Match filename="xxx" or filename=xxx
  const filenameMatch = contentDisposition.match(
    /filename\s*=\s*"?([^";]+)"?/
  );
  if (filenameMatch?.[1]) {
    return decodeURIComponent(filenameMatch[1].trim());
  }

  return "download";
};

export const downloadFile = (response: AxiosResponse) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      try {
        const jsonData = JSON.parse(this.result as string);
        // Parsed successfully, meaning it's a regular JSON response
        if (jsonData?.code !== 200) {
          toast.error(jsonData?.message ?? "Download failed");
          reject(jsonData);
        }
      } catch {
        // JSON parsing failed, meaning it's a normal file stream
        const contentType =
          response?.headers?.["content-type"] ||
          "application/octet-stream";
        const blob = new Blob([response.data], { type: contentType });

        const contentDisposition =
          response?.headers?.["content-disposition"];
        const filename = parseFilename(contentDisposition);

        // Save file locally
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        resolve(response.data);
      }
    };
    fileReader.readAsText(response.data);
  });
};
  