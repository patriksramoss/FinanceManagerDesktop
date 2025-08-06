import { useState, useEffect } from "react";
import styles from "./Identity.module.scss";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import useAuthStore from "src/stores/Auth";
import Loader from "src/components/Loader/Loader";

const Identity: React.FC = () => {
  const [essentialData, setEssentialData] = useState<any>(null);
  const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
  useEffect(() => {
    const fetchTokenAndData = async () => {
      const token = await loadAccessToken();
      if (!token) {
        console.warn("No cached access token found.");
        return;
      }
      console.log("4444444444444");

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

  if (!essentialData)
    return (
      <div className={styles.homeContainer}>
        <div className={styles.flexBox}>
          <div className={styles.identityWrapper}>
            <Loader loading={true} />
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.homeContainer}>
      <div className={styles.flexBox}>
        <div className={styles.identityWrapper}>
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
      </div>
    </div>
  );
};

export default Identity;
