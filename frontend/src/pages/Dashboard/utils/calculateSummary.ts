type Transaction = {
  amount: number | string;
};

export function calculateSummary(transactions: Transaction[]) {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    const amount = Number(t.amount) || 0;

    if (amount < 0) {
      income += Math.abs(amount);
    } else if (amount > 0) {
      expense += amount;
    }
  }

  return {
    income,
    expense,
    net: income - expense,
  };
}
