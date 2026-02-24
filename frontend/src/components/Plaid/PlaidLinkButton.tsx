import React, { useState, useEffect } from "react";
import {
  usePlaidLink,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkError,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnEventMetadata,
} from "react-plaid-link";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { getAccessToken } from "src/stores/Plaid";
import Loader from "src/components/Loader/Loader";

interface PlaidLinkButtonProps {
  onSuccess: (
    access_token: string,
    metadata: PlaidLinkOnSuccessMetadata,
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
      metadata: PlaidLinkOnSuccessMetadata,
    ) => {
      console.log("Public Token:", public_token);
      console.log("Metadata:", metadata);
      try {
        const accessToken = await getAccessToken(public_token);
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
        `${backendUrl}/api/plaid/create-link-token`,
      );

      try {
        const response = await fetch(
          `${backendUrl}/api/plaid/create-link-token`,
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
      <Loader loading={loading} />

      {!loading && fetchError && (
        <div className="text-sm text-red-600 mt-2">{fetchError}</div>
      )}

      {!loading && !fetchError && (
        <button
          onClick={() => open()}
          disabled={!ready || loading}
          className="
        flex flex-col items-center
        px-[18px] py-2
        rounded-md border-none
        text-white
        bg-gradient-to-b from-[#4b91f7] to-[#367af6]
        shadow-[0px_0.5px_1.5px_rgba(54,122,246,0.25),inset_0px_0.8px_0px_-0.25px_rgba(255,255,255,0.2)]
        transition-transform duration-150
        hover:scale-105
        focus:outline-none
        focus:shadow-[inset_0px_0.8px_0px_-0.25px_rgba(255,255,255,0.2),0px_0.5px_1.5px_rgba(54,122,246,0.25),0px_0px_0px_3.5px_rgba(58,108,217,0.5)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      "
        >
          Connect with Plaid
        </button>
      )}

      {error && (
        <div className="text-sm text-red-600 mt-2">Error: {error.message}</div>
      )}
    </div>
  );
};

export default PlaidLinkButton;
