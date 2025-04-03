// backend/routes/plaidRoutes.ts
import express from "express";
import { createLinkToken } from "../controllers/plaidController";

const router = express.Router();

router.get("/create-link-token", createLinkToken);

export default router;
