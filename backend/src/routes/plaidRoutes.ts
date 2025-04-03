// backend/routes/plaidRoutes.ts
import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  getTransactions,
  getEssentialData,
} from "../controllers/plaidController";

const router = express.Router();

router.get("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);
router.post("/get-transactions", getTransactions);
router.post("/get-essential-data", getEssentialData);

export default router;
