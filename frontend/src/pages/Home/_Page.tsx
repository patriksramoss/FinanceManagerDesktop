import React, { useState, useEffect } from "react";
import PlaidLinkButton from "../../components/Plaid/PlaidLinkButton";
import { fetchTransactions } from "../../utils/fetchTransactions";
import { Transaction } from "./interfaces";
import type { Error } from "./interfaces";
import axios from "axios";

const Home: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [essentialData, setEssentialData] = useState<any | null>(null); // For storing essential data (accounts, identity, institution)

  // This function is called after successfully exchanging the public token to get the access token.
  const handlePlaidSuccess = async (access_token: string): Promise<void> => {
    try {
      setAccessToken(access_token); // Store the access token in state
      localStorage.setItem("accessToken", access_token); // Store it in localStorage

      // Fetch transactions here after the access_token is set
      setLoading(true);
      fetchTransactions(access_token)
        .then((data) => setTransactions(data.transactions || []))
        .catch(() => {
          setError({ message: "Error fetching transactions" });
        })
        .finally(() => setLoading(false));

      // Fetch essential data after setting the access token
      fetchEssentialData(access_token);
    } catch (err) {
      console.error("Error handling plaid success:", err);
      setError({ message: "Failed to store access token." });
    }
  };

  // Function to fetch essential data (accounts, identity, institution)
  const fetchEssentialData = async (access_token: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/plaid/get-essential-data",
        {
          access_token: access_token,
        }
      );
      setEssentialData(response.data); // Store the essential data in state
    } catch (err) {
      setError({ message: "Error fetching essential data" });
    } finally {
      setLoading(false);
    }
  };

  // Load Access Token from Local Storage
  useEffect(() => {
    const storedToken: string | null = localStorage.getItem("accessToken");
    setAccessToken(storedToken);
  }, []);

  // Fetch Transactions and Essential Data if Access Token Exists
  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      // Fetch transactions first
      fetchTransactions(accessToken)
        .then((data) => setTransactions(data.transactions || []))
        .catch(() => {
          setError({ message: "Error fetching transactions" });
        });

      // Fetch essential data (accounts, identity, institution)
      fetchEssentialData(accessToken);
    }
  }, [accessToken]);

  return (
    <div>
      {!accessToken ? (
        <PlaidLinkButton onSuccess={handlePlaidSuccess} />
      ) : (
        <div>
          <h2>Essential Data</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error.message}</p>
          ) : (
            <div>
              <h3>Accounts</h3>
              <ul>
                {essentialData?.accounts?.map((account: any, index: number) => (
                  <li key={index}>
                    <strong>{account.name}</strong> - $
                    {account.balance.available} available
                  </li>
                ))}
              </ul>

              <h3>Identity</h3>
              <ul>
                <li>Name: {essentialData?.identity?.full_name}</li>
                <li>Email: {essentialData?.identity?.email}</li>
              </ul>

              <h3>Institution</h3>
              <p>{essentialData?.institution?.name}</p>
            </div>
          )}

          <h2>Transactions</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error.message}</p>
          ) : (
            <ul>
              {transactions.map((tx, index) => (
                <li key={index}>
                  <strong>{tx.name}</strong> - ${tx.amount} on {tx.date}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
