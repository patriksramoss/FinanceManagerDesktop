import axios from "axios";
import { create } from "zustand";
import { EssentialData } from "src/api/plaid/types";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

let accessToken: string | null = null;

interface PlaidStore {
  cache: Record<string, EssentialData>;
  selectedMonthDashboard: string | null;
  getEssentialData: (month: string) => EssentialData | undefined;
  setEssentialData: (month: string, data: EssentialData) => void;
  setSelectedMonthDashboard: (month: string) => void;
  clearCache: () => void;
}

const usePlaidStore = create<PlaidStore>((set, get) => ({
  cache: {},
  selectedMonthDashboard: null,
  getEssentialData: (month) => get().cache[month],
  setEssentialData: (month, data) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [month]: data,
      },
    })),
  setSelectedMonthDashboard: (month) => set({ selectedMonthDashboard: month }),
  clearCache: () => set({ cache: {} }),
}));

export const getCachedAccessToken = async (): Promise<string | null> => {
  if (accessToken) return accessToken;

  // @ts-ignore: window.electronAPI is injected via preload
  const stored = await window.electronAPI.getAccessToken();
  if (stored) {
    accessToken = stored;
    return stored;
  }

  return null;
};
export const getAccessToken = async (publicToken: string): Promise<string> => {
  if (accessToken) return accessToken;

  const stored = await getCachedAccessToken();
  if (stored) return stored;

  const response = await axios.post(
    `${backendUrl}/api/plaid/exchange-public-token`,
    {
      public_token: publicToken,
    }
  );

  const newAccessToken = response.data.access_token;

  accessToken = newAccessToken;

  // @ts-ignore
  await window.electronAPI.saveAccessToken(newAccessToken);

  return newAccessToken;
};

export const clearAccessToken = async () => {
  // @ts-ignore
  await window.electronAPI.clearAccessToken();
  accessToken = null;
};

export default usePlaidStore;
