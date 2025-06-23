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
import moment from "moment";

const clientId = process.env.PLAID_CLIENT_ID;
const secret = process.env.PLAID_SECRET;

if (!clientId || !secret) {
  throw new Error(
    "Plaid client ID or secret is missing in the environment variables."
  );
}

const configuration = new Configuration({
  basePath: "https://sandbox.plaid.com",
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
        client_user_id: "user123",
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

export const exchangePublicToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { public_token } = req.body;

  if (!public_token) {
    res.status(400).json({
      error: "Public token is required",
      error_code: "MISSING_FIELDS",
    });
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const access_token = response.data.access_token;
    const item_id = response.data.item_id;

    res.json({ access_token, item_id });
  } catch (error: any) {
    console.error("Error exchanging public token:", error);

    if (error.response?.data?.error_code) {
      res.status(400).json({
        error_message: error.response.data.error_message,
        error_code: error.response.data.error_code,
      });
    }

    res.status(500).json({ error: "Failed to exchange public token" });
  }
};

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { access_token } = req.body;

  if (!access_token) {
    res.status(400).json({ error: "Access token is required" });
  }

  try {
    const response = await plaidClient.transactionsGet({
      access_token: access_token,
      start_date: "2022-01-01",
      end_date: "2022-12-31",
    });

    const transactions = response.data.transactions;
    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    const axiosError = error as AxiosError;
    res.status(500).json({
      error: axiosError.response?.data || "Failed to fetch transactions",
    });
  }
};

export const getEssentialData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { access_token, month } = req.body;

  if (!access_token) {
    res.status(400).json({ error: "Access token is required" });
  }

  try {
    const monthToUse = month || moment().format("YYYY-MM");
    const startDate = moment(monthToUse, "YYYY-MM")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(monthToUse, "YYYY-MM")
      .endOf("month")
      .format("YYYY-MM-DD");

    const accountsResponse = await plaidClient.accountsGet({
      access_token: access_token,
    });

    const identityResponse = await plaidClient.identityGet({
      access_token: access_token,
    });

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: access_token,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 500,
        offset: 0,
      },
    });

    const data = {
      accounts: accountsResponse.data.accounts,
      identity: identityResponse.data,
      transactions: transactionsResponse.data.transactions,
    };

    res.json(data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching Plaid data:", axiosError.response?.data);
    res.status(500).json({
      error: axiosError.response?.data || "Failed to fetch data from Plaid",
    });
  }
};
