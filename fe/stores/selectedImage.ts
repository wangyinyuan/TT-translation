import { create } from "zustand";

interface SelectedImageState {
  imgUrl: string;
  setImgUrl: (imgUrl: string) => void;
}

export const useSelectedImageStore = create<SelectedImageState>()((set) => {
  return {
    imgUrl: "",
    setImgUrl: (imgUrl: string) => set({ imgUrl }),
  };
});
