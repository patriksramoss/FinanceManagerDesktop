import useAuthStore from "src/stores/Auth";
import usePlaidStore from "src/stores/Plaid";
import { EssentialData } from "./types";
import dayjs from "dayjs";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const loadAccessToken = useAuthStore.getState().loadAccessToken;
const getCachedEssentialData = usePlaidStore.getState().getEssentialData;
const cacheEssentialData = usePlaidStore.getState().setEssentialData;

export const getEssentialData = async (
  selectedMonth?: string | null,
): Promise<EssentialData> => {
  const setSelectedMonth = selectedMonth
    ? selectedMonth
    : dayjs().format("YYYY-MM");

  const cached = getCachedEssentialData(setSelectedMonth);
  if (cached) return cached;

  const token = await loadAccessToken();
  console.log("!!!!!!!!! token", token);
  if (!token) {
    console.warn("No cached access token found.");
    throw new Error("No cached access token found.");
  }

  const response = await fetch(`${backendUrl}/api/plaid/get-essential-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      access_token: token,
      month: selectedMonth,
    }),
  });

  if (!response.ok) throw new Error(`Status ${response.status}`);

  const data: EssentialData = await response.json();

  const completedTransactions = data.transactions.filter((t) => !t.pending);
  const allTransactionSum = Number(
    completedTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2),
  );

  const enrichedData: EssentialData & {
    dashboard: { allTransactionSum: number };
  } = {
    ...data,
    dashboard: {
      allTransactionSum,
    },
  };

  cacheEssentialData(setSelectedMonth, enrichedData);

  return enrichedData;
};
