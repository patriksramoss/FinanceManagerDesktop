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
    public_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => void;
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ onSuccess }) => {
  const [token, setToken] = useState<string | null>(null);

  // Define the PlaidLink configuration options with the token
  const config: PlaidLinkOptionsWithLinkToken = {
    token: token!,
    onSuccess: (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      console.log("Public Token:", public_token);
      console.log("Metadata:", metadata);
      onSuccess(public_token, metadata); // Call the passed onSuccess function
    },
    onExit: (error: PlaidLinkError | null) => {
      if (error) {
        console.error("Plaid Link Error:", error);
      }
    },
    onEvent: (event: string, metadata: PlaidLinkOnEventMetadata) => {
      console.log("Plaid Event:", event);
      console.log("Metadata:", metadata);
    },
  };

  // Use the Plaid Link hook to manage Plaid linking
  const { open, ready, error } = usePlaidLink(config);

  useEffect(() => {
    const fetchLinkToken = async () => {
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
      }
    };

    fetchLinkToken();
  }, []);

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        Connect with Plaid
      </button>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default PlaidLinkButton;
