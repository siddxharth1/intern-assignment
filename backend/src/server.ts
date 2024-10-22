import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConnect";
import authRoutes from "./routes/authRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "https://intern-assignment-navy.vercel.app/login", // Frontend origin
    credentials: true, // Allows cookies to be sent
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
