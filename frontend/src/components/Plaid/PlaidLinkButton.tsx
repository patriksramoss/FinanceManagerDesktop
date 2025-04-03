import React, { useState, useEffect } from "react";
import {
  usePlaidLink,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkError,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnEventMetadata,
} from "react-plaid-link";

interface PlaidLinkButtonProps {
  onSuccess: (
    access_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => void;
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ onSuccess }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null); // For handling token fetch errors

  // Plaid Link configuration
  const config: PlaidLinkOptionsWithLinkToken = {
    token: token!, // Token for linking
    onSuccess: async (
      public_token: string,
      metadata: PlaidLinkOnSuccessMetadata
    ) => {
      console.log("Public Token:", public_token);
      console.log("Metadata:", metadata);

      // Exchange public token for access token
      try {
        const response = await fetch(
          "http://localhost:5000/api/plaid/exchange-public-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ public_token }),
          }
        );
        const data = await response.json();

        if (response.ok) {
          console.log("Access Token:", data.access_token);
          console.log("Item ID:", data.item_id);

          // Pass the access token to the onSuccess callback
          onSuccess(data.access_token, metadata);
        } else {
          console.error("Failed to exchange public token:", data.error);
          setFetchError(data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error sending public token to backend:", error);
        setFetchError("Error exchanging public token with the backend.");
      }
    },
    onExit: (error: PlaidLinkError | null) => {
      if (error) {
        console.error("Plaid Link Error:", error);
        setFetchError("An unknown error occurred during Plaid Link exit.");
      }
    },
    onEvent: (event: string, metadata: PlaidLinkOnEventMetadata) => {
      console.log("Plaid Event:", event);
      console.log("Metadata:", metadata);
    },
  };

  // Plaid Link hook to manage linking
  const { open, ready, error } = usePlaidLink(config);

  // Fetch link token on component mount
  useEffect(() => {
    const fetchLinkToken = async () => {
      setLoading(true); // Start loading when we fetch the token
      setFetchError(null); // Reset any previous errors

      try {
        const response = await fetch(
          "http://localhost:5000/api/plaid/create-link-token"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setToken(data.link_token);
      } catch (err) {
        console.error("Error fetching link token:", err);
        setFetchError("Error fetching the link token from the backend.");
      } finally {
        setLoading(false); // Stop loading after token fetch attempt
      }
    };

    fetchLinkToken();
  }, []);

  return (
    <div>
      {loading && <p>Loading Plaid...</p>}
      {!loading && fetchError && <div className="error">{fetchError}</div>}

      <button onClick={() => open()} disabled={!ready || loading}>
        Connect with Plaid
      </button>
      {error && <div className="error">Error: {error.message}</div>}
    </div>
  );
};

export default PlaidLinkButton;
