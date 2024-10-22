import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  convertToPDF,
  createInvoice,
  getProducts,
} from "../controllers/invoiceController";

const router = express.Router();

router.get("/convert-pdf", protect, convertToPDF);
router.post("/add-product", protect, createInvoice);
router.get("/products", protect, getProducts);

export default router;
