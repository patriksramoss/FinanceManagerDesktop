import { plaidController } from "src/api/plaid/index";
import useAuthStore from "src/stores/Auth";

export const fetchTokenAndData = async (selectedMonth: string) => {
  const token = await useAuthStore.getState().loadAccessToken();

  if (!token) {
    console.warn("No cached access token found.");
    return null;
  }

  try {
    const data = await plaidController.getEssentialData(selectedMonth);
    return data ?? null;
  } catch (error) {
    console.error("Error fetching essential data:", error);
    return null;
  }
};
