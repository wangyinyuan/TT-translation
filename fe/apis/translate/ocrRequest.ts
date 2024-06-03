import { OCR_API_KEY, OCR_SERVER_URL } from "@/constants/server";
import { request } from "../request";

export const ocrRequestPath = `/parse/image`;

export interface OCRParams {
  file: FormData;
}

export interface OCRResponse {
  ParsedResults: any[];
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ErrorMessage: any[] | null;
  ErrorDetails: any[] | null;
  ProcessingTimeInMilliseconds: string;
}

export async function ocrRequest({ file }: OCRParams) {
  return request<OCRResponse>({
    baseURL: OCR_SERVER_URL,
    url: ocrRequestPath,
    method: "POST",
    headers: {
      apikey: OCR_API_KEY,
      "Content-Type": "multipart/form-data",
    },
    data: file,
  });
}
