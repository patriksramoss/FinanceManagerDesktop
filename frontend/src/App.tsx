import React from "react";
import PlaidLinkButton from "./components/Plaid/PlaidLinkButton";
import { PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import "./styles/global.scss";

const App: React.FC = () => {
  const handlePlaidSuccess = (
    public_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    console.log("Plaid Success: ", public_token, metadata);

    // You can send the public_token to your backend to exchange it for an access_token
    // or to create a user account in your system
    // For example:
    // fetch('/api/plaid/exchange-token', { method: 'POST', body: JSON.stringify({ public_token }) });
  };

  return (
    <div className="App">
      <PlaidLinkButton onSuccess={handlePlaidSuccess} />
    </div>
  );
};

export default App;
