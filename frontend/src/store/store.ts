import { create } from "zustand";

type RootStore = {
  countries: string[];
  setCountries: (countries: string[]) => void;
  dateFrom: Date | null;
  setDateFrom: (dateFrom: Date | null) => void;
  dateTo: Date | null;
  setDateTo: (dateTo: Date | null) => void;
  userEmail: string;
  setUserEmail: (userEmail: string) => void;
};
export const useRootStore = create<RootStore>()((set, get) => ({
  countries: [],
  setCountries: (countries: string[]) => set({ countries }),
  dateFrom: null,
  setDateFrom: (dateFrom: Date | null) => set({ dateFrom }),
  dateTo: null,
  setDateTo: (dateTo: Date | null) => set({ dateTo }),
  userEmail: "",
  setUserEmail: (userEmail: string) => set({ userEmail }),
}));
