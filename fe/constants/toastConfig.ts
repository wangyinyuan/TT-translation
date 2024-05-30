import { bg, text } from "@/styles/colors";

const toastColor = {
  success: {
    bg: bg.green_200,
    text: text.green_950,
  },
  error: {
    bg: bg.red_200,
    text: text.red_900,
  },
  warning: {
    bg: bg.yellow_200,
    text: text.yellow_900,
  },
  info: {
    bg: bg.purple_200,
    text: text.purple_900,
  },
};

export const toastConfig = {
  success: {
    position: 50,
    backgroundColor: toastColor.success.bg,
    textColor: toastColor.success.text,
  },
  error: {
    position: 50,
    backgroundColor: toastColor.error.bg,
    textColor: toastColor.error.text,
  },
  warning: {
    position: 50,
    backgroundColor: toastColor.warning.bg,
    textColor: toastColor.warning.text,
  },
  info: {
    position: 50,
    backgroundColor: toastColor.info.bg,
    textColor: toastColor.info.text,
  },
};
