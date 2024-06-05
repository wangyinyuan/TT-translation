// @ts-ignore
import SHA256 from "crypto-js/sha256";
// @ts-ignore
import Base64 from "crypto-js/enc-base64";

export const getAudioFileName = (base64: string) => {
  const hash = SHA256(base64);
  console.log("hash", hash);
  const base64Hash = Base64.stringify(hash);
  // 使用 URL 安全的 Base64 编码
  const urlSafeBase64 = base64Hash
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `audio_${urlSafeBase64}.wav`;
};
