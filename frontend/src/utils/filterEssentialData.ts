import { EssentialData } from "src/api/plaid/types";

export function getFilteredEssentialData(
  monthData: EssentialData | undefined,
  account: string | null,
  category: string | null,
): EssentialData | undefined {
  if (!monthData) return undefined;

  const isAccountFiltered = account && account !== "all";
  const isCategoryFiltered = category && category !== "all";

  const transactions = (monthData.transactions ?? []).filter(
    (t) =>
      (!isAccountFiltered || t.account_id === account) &&
      (!isCategoryFiltered || t.category?.includes(category)),
  );

  const accounts = isAccountFiltered
    ? monthData.accounts.filter((a) => a.account_id === account)
    : monthData.accounts;

  return { ...monthData, transactions, accounts };
}
