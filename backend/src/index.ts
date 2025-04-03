require("dotenv").config();
import express from "express";
import plaidRoutes from "./routes/plaidRoutes";
import cors from "cors";

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

// Use JSON middleware
app.use(express.json());

// Use Plaid routes
app.use("/api/plaid", plaidRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
