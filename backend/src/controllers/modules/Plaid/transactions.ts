require("dotenv").config();
import { Request, Response } from "express";
import { AxiosError } from "axios";
import { plaidClient } from "../../plaidController";
import dayjs from "dayjs";

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { access_token, start_date, end_date } = req.body;

  if (!access_token) {
    res.status(400).json({ error: "Access token is required" });
    return;
  }

  const startDate =
    start_date || dayjs().subtract(30, "day").format("YYYY-MM-DD");
  const endDate = end_date || dayjs().format("YYYY-MM-DD");

  try {
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: startDate,
      end_date: endDate,
    });

    res.json({ transactions: response.data.transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    const axiosError = error as AxiosError;
    res.status(500).json({
      error: axiosError.response?.data || "Failed to fetch transactions",
    });
  }
};
