import { LangsChoice } from "@/types/translate/lang";
import { create } from "zustand";

interface CurLangsState {
  langs: LangsChoice;
  setLangs: (langs: LangsChoice) => void;
}

export const useCurLangsStore = create<CurLangsState>()((set) => {
  return {
    langs: {
      from: "auto",
      to: "EN",
    },
    setLangs: (langs: LangsChoice) => set({ langs }),
  };
});
