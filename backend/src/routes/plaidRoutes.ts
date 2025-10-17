import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getTransactions,
  getEssentialData,
  getAccounts,
} from "../controllers/plaidController";

const router = express.Router();

router.get("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);
router.post("/get-transactions", getTransactions);
router.post("/get-accounts", getAccounts);
router.post("/get-essential-data", getEssentialData);

export default router;
