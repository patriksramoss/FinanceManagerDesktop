import React, { useState, useEffect } from "react";
import {
  usePlaidLink,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkError,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnEventMetadata,
} from "react-plaid-link";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Store from "src/Store";

interface PlaidLinkButtonProps {
  onSuccess: (
    access_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => void;
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ onSuccess }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  if (!backendUrl) {
    throw new Error("VITE_BACKEND_URL is not defined in .env");
  }

  const config: PlaidLinkOptionsWithLinkToken = {
    token: token!,
    onSuccess: async (
      public_token: string,
      metadata: PlaidLinkOnSuccessMetadata
    ) => {
      console.log("Public Token:", public_token);
      console.log("Metadata:", metadata);
      try {
        const accessToken = await Store.getAccessToken(public_token);
        onSuccess(accessToken, metadata);
      } catch (err) {
        console.error("Token exchange error:", err);
        setFetchError("Error exchanging token");
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

  const { open, ready, error } = usePlaidLink(config);

  useEffect(() => {
    const fetchLinkToken = async () => {
      setLoading(true);
      setFetchError(null);

      console.log(
        "BACKEND URL FETCH LINK TOKEN",
        `${backendUrl}/api/plaid/create-link-token`
      );

      try {
        const response = await fetch(
          `${backendUrl}/api/plaid/create-link-token`
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
        setLoading(false);
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
