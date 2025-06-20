const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const fetchTransactions = async (accessToken: string) => {
  const response = await fetch(`${backendUrl}/api/plaid/get-transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ access_token: accessToken }),
  });

  if (!response.ok) throw new Error("Failed to fetch transactions");
  return response.json();
};
