import { useState, useEffect } from "react";
import styles from "./EssentialData.module.scss";
import Store from "src/Store";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#d0ed57",
  "#a4de6c",
  "#d88884",
];

const EssentialData = () => {
  const [essentialData, setEssentialData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndData = async () => {
      const token = await Store.getCachedAccessToken();
      if (!token) {
        console.warn("No cached access token found.");
        return;
      }

      setAccessToken(token);

      try {
        const response = await fetch(
          `${backendUrl}/api/plaid/get-essential-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              access_token: token,
            }),
          }
        );

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        console.log("datadatadatadata", data);

        setEssentialData(data);
      } catch (error) {
        console.error("Error fetching essential data:", error);
      }
    };

    fetchTokenAndData();
  }, []);

  if (!essentialData) return <p>Loading essential data...</p>;

  return (
    <div className={styles["essential-data"]}>
      <h2>Essential Data</h2>

      <h3>Accounts</h3>
      <div className={styles.accounts}>
        {essentialData.accounts.map((account: any) => (
          <div key={account.account_id} className={styles.section}>
            <p>
              <strong>{account.name}</strong> ({account.subtype})
            </p>
            <p>
              Balance: {account.balances.current}{" "}
              {account.balances.iso_currency_code}
            </p>
            <p>Account Number: ****{account.mask}</p>
          </div>
        ))}
      </div>

      <h3>Identity</h3>
      <div className={styles.identity}>
        {essentialData.identity.accounts.map((account: any) => (
          <div key={account.account_id} className={styles.section}>
            <p>
              <strong>{account.name}</strong> ({account.subtype})
            </p>
            {account.owners.map((owner: any, index: number) => (
              <div key={index}>
                <p>Owner(s): {owner.names.join(", ")}</p>
                <p>
                  Emails:{" "}
                  {owner.emails.map((email: any) => email.data).join(", ")}
                </p>
                <p>
                  Phone Numbers:{" "}
                  {owner.phone_numbers
                    .map((phone: any) => phone.data)
                    .join(", ")}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssentialData;
