import { EssentialData, PlaidTransaction } from "src/api/plaid/types";

export type DailyMap = Record<
  string,
  {
    income: number;
    expense: number;
    transactions: PlaidTransaction[];
  }
>;

export function mapTransactions(essentialData?: EssentialData): DailyMap {
  const map: DailyMap = {};

  if (!essentialData?.transactions) return map;

  for (const t of essentialData.transactions) {
    if (t.pending) continue;

    const key = t.date;
    if (!map[key]) {
      map[key] = { income: 0, expense: 0, transactions: [] };
    }

    map[key].transactions.push(t);

    if (t.amount < 0) {
      map[key].income += Math.abs(t.amount);
    } else {
      map[key].expense += t.amount;
    }
  }

  return map;
}
