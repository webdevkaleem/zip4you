import { create } from "zustand";

interface MediaType {
  key: string;
  name: string;
  size: number;
  show: boolean;
  visibility: "public" | "private";
}

interface MediaActions {
  setName: (name: string) => void;
  setSize: (size: number) => void;
  setKey: (key: string) => void;
  setShow: (show: boolean) => void;
  setVisibility: (visibility: "public" | "private") => void;
  resetMedia: () => void;
}

const initialState: MediaType = {
  key: "",
  name: "",
  size: 0,
  show: false,
  visibility: "private",
};

export const useMediaStore = create<MediaType & MediaActions>()((set) => ({
  ...initialState,
  setName: (name) => set(() => ({ name })),
  setSize: (size) => set(() => ({ size })),
  setKey: (key) => set(() => ({ key })),
  setShow: (show) => set(() => ({ show })),
  setVisibility: (visibility) => set(() => ({ visibility })),
  resetMedia: () => set(() => ({ ...initialState })),
}));
