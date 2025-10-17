import usePlaidStore, { getCachedAccessToken } from "src/stores/Plaid";
import { EssentialData, PlaidAccount } from "./types";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const plaidController = {
  async getEssentialData(month: string) {
    const store = usePlaidStore.getState();
    const cached = store.getEssentialData(month);
    if (cached) return cached;
    const token = await getCachedAccessToken();
    if (!token) throw new Error("Missing access token");
    const response = await fetch(`${backendUrl}/api/plaid/get-essential-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        access_token: token,
        month: month,
      }),
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data: EssentialData = await response.json();
    const completedTransactions = data.transactions.filter((t) => !t.pending);
    const allTransactionSum = Number(
      completedTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)
    );
    const enrichedData: EssentialData & {
      dashboard: { allTransactionSum: number };
    } = {
      ...data,
      dashboard: {
        allTransactionSum,
      },
    };

    store.setEssentialData(month, enrichedData);
    return enrichedData;
  },

  async getAccounts() {
    console.log("get accounts");
    const store = usePlaidStore.getState();
    store.accountsLoading = true;
    const token = await getCachedAccessToken();
    if (!token) throw new Error("Missing access token");
    console.log("get accounts 1");

    const response = await fetch(`${backendUrl}/api/plaid/get-accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        access_token: token,
      }),
    });

    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data: PlaidAccount[] = await response.json();

    store.accountsLoading = false;
    store.setAccounts(data);
    return data;
  },
};

export default plaidController;
