import useAuthStore from "src/stores/Auth";
import usePlaidStore from "src/stores/Plaid";
import { EssentialData } from "./types";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
const getCachedEssentialData = usePlaidStore.getState().getEssentialData;
const cacheEssentialData = usePlaidStore.getState().setEssentialData;

export const getEssentialData = async (
  selectedMonth: string
): Promise<EssentialData> => {
  console.log("GETTING ESSENTIAL DATA");
  const cached = getCachedEssentialData(selectedMonth);
  if (cached) return cached;

  const token = await loadAccessToken();
  if (!token) {
    console.warn("No cached access token found.");
    throw new Error("No cached access token found.");
  }

  console.log("1111111111111");

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
  cacheEssentialData(selectedMonth, data);
  console.log("ENDING ESSENTIAL DATA");

  return data;
};
