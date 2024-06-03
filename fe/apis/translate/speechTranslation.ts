import { request } from "@/apis/request";
import { LangsValue } from "@/types/translate/lang";

export const speechTranslationPath = "/speechTranslate";

interface SpeechTranslationParams {
  file: FormData;
  from: LangsValue | "auto";
  to: LangsValue;
}

interface SpeechTranslationResponse {
  recognition_result: string;
  translation_result: string;
  SourceSpeechResponse: {
    audio: string;
  };
  TargetSpeechResponse: {
    audio: string;
  };
}

export const speechTranslationReq = ({
  file,
  from,
  to,
}: SpeechTranslationParams) => {
  return request<SpeechTranslationResponse>({
    url: speechTranslationPath,
    method: "POST",
    timeout: 120000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      source_language: from,
      target_language: to,
    },
    data: file,
  });
};
