require("dotenv").config();
import { Request, Response } from "express";
import {
  Configuration,
  PlaidApi,
  LinkTokenCreateRequest,
  Products,
  CountryCode,
} from "plaid";
import { AxiosError } from "axios";

// Ensure that environment variables are available
const clientId = process.env.PLAID_CLIENT_ID;
const secret = process.env.PLAID_SECRET;

// if (!clientId || !secret) {
//   throw new Error(
//     "Missing Plaid client ID or secret in environment variables."
//   );
// }

// Initialize Plaid API Client
const configuration = new Configuration({
  basePath: "https://sandbox.plaid.com", // For sandbox environment, use other URLs for production
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": clientId,
      "PLAID-SECRET": secret,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export const createLinkToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const request: LinkTokenCreateRequest = {
      user: {
        client_user_id: "user123", // Replace with dynamic user ID if necessary
      },
      client_name: "Finance Manager",
      products: [Products.Transactions],
      country_codes: [CountryCode.Lv],
      language: "lv",
    };

    const response = await plaidClient.linkTokenCreate(request);

    res.json({ link_token: response.data.link_token });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "Error creating link token:",
      axiosError.response?.data || axiosError.message || axiosError
    );
    res.status(500).json({ error: "Failed to create link token" });
  }
};
