import { BASE_URL } from "@/constants/server";
import Toast from "react-native-root-toast";
import axios, { AxiosRequestConfig } from "axios";
import { toastConfig } from "@/constants/toastConfig";

const httpInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

httpInstance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (e) => {
    if (!e.response) {
      Toast.show("网络错误！", toastConfig.error);
    } else {
      Toast.show("出错啦：" + e.message, toastConfig.error);
    }

    return Promise.reject(e);
  }
);

export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return httpInstance.request(config).catch((e) => {
    console.error(e);
    throw e;
  }) as Promise<T>;
}
