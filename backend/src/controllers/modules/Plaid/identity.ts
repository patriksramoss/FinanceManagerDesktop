require("dotenv").config();
import { Request, Response } from "express";
import { AxiosError } from "axios";
import { plaidClient } from "../../plaidController";

export const getIdentity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { access_token } = req.body;
  if (!access_token) {
    res.status(400).json({ error: "Access token is required" });
    return;
  }

  try {
    const response = await plaidClient.identityGet({ access_token });
    res.json(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    res.status(500).json({
      error: axiosError.response?.data || "Failed to fetch identity",
    });
  }
};
