import { request } from "@/apis/request";

export const getTranslationPath = "/translate";

interface GetTranslationParams {
  text: string;
  from: string;
  to: string;
}

interface GetTranslationResponse {
  translation: string;
}

export const getTranslation = ({ text, from, to }: GetTranslationParams) => {
  return request<GetTranslationResponse>({
    url: getTranslationPath,
    method: "GET",
    params: {
      text,
      source_language: from,
      target_language: to,
    },
  });
};
