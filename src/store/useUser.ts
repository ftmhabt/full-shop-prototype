import { create } from "zustand";

interface UserStore {
  userId: string | null;
  setUserId: (id: string) => void;
}

export const useUser = create<UserStore>((set) => ({
  userId: null,
  setUserId: (id: string) => set({ userId: id }),
}));
