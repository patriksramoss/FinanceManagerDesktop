import axios from "axios";
import { create } from "zustand";
import { EssentialData, PlaidAccount } from "src/api/plaid/types";
import dayjs from "dayjs";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

let accessToken: string | null = null;

interface PlaidStore {
  cache: Record<string, EssentialData>;
  cacheAccounts: PlaidAccount;
  selectedMonthDashboard: string | null;
  selectedAccountDashboard: string | null;
  selectedCategoryDashboard: string | null;
  accounts: PlaidAccount[] | null;
  accountsLoading: boolean;
  essentialDataLoading: boolean;
  accountsError: string | null;
  getEssentialData: (month: string) => EssentialData | undefined;
  setEssentialData: (month: string, data: EssentialData) => void;
  getAccounts: () => PlaidAccount[] | null;
  setAccounts: (data: PlaidAccount[]) => void;
  setAccountsLoading: (loading: boolean) => void;
  setEssentialDataLoading: (loading: boolean) => void;
  setSelectedMonthDashboard: (month: string) => void;
  setSelectedAccountDashboard: (account_id: string) => void;
  setSelectedCategoryDashboard: (category: string) => void;
  clearCache: () => void;
}

const usePlaidStore = create<PlaidStore>((set, get) => ({
  cache: {},
  cacheAccounts: {
    account_id: "",
    balances: {
      available: null,
      current: 0,
      iso_currency_code: "",
      limit: null,
      unofficial_currency_code: null,
    },
    mask: "",
    name: "",
    official_name: "",
    subtype: "",
    type: "",
  },
  selectedMonthDashboard: dayjs().format("YYYY-MM"),
  selectedAccountDashboard: null,
  selectedCategoryDashboard: null,
  accounts: [],
  accountsLoading: false,
  essentialDataLoading: false,
  accountsError: null,
  getEssentialData: (month) => get().cache[month],
  setEssentialData: (month, data) =>
    set((state) => ({
      cache: { ...state.cache, [month]: data },
    })),
  setSelectedAccountDashboard: (account_id) =>
    set({ selectedAccountDashboard: account_id }),
  setSelectedCategoryDashboard: (category) =>
    set({ selectedCategoryDashboard: category }),
  setSelectedMonthDashboard: (month) =>
    set({ selectedMonthDashboard: month || dayjs().format("YYYY-MM") }),
  getAccounts: () => get().accounts,

  setAccounts: (data) =>
    set(() => ({
      accounts: data,
    })),
  setAccountsLoading: (loading: boolean) => set({ accountsLoading: loading }),
  setEssentialDataLoading: (loading: boolean) =>
    set({ essentialDataLoading: loading }),
  clearCache: () => set({ cache: {} }),
}));

export default usePlaidStore;

/* ------------------------------
   ACCESS TOKEN MANAGEMENT
------------------------------ */

export const getCachedAccessToken = async (): Promise<string | null> => {
  if (accessToken) return accessToken;

  // @ts-ignore
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
  console.log("Stored access token:", stored);
  if (stored) return stored;

  const response = await axios.post(
    `${backendUrl}/api/plaid/exchange-public-token`,
    { public_token: publicToken },
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
