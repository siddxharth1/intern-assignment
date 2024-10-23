import { Request, Response } from "express";
import Invoice, { IInvoice } from "../models/invoiceModel";
import puppeteer from "puppeteer";
import { generateInvoiceHTML } from "../utils/generateInvoiceHTML";
const fs = require("fs");
const path = require("path");

interface CustomRequest extends Request {
  user?: any;
}
export const createInvoice = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { name, quantity, price } = req.body;

  // Validate input fields
  if (!name || isNaN(quantity) || isNaN(price)) {
    return res.status(400).json({
      message:
        "Invalid input: Please provide valid product name, quantity, and price.",
    });
  }

  try {
    // Find existing invoice for the user
    let userInvoice = await Invoice.findOne({ user: req.user._id });

    if (userInvoice) {
      userInvoice.products.push({ name, quantity, price });

      // Recalculate total and GST
      userInvoice.total = userInvoice.products.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0
      );
      userInvoice.gst = userInvoice.total * 0.18;

      await userInvoice.save();
    } else {
      // If no invoice exists, create new one
      const total = quantity * price;
      const gst = total * 0.18;

      userInvoice = await Invoice.create({
        user: req.user._id,
        products: [{ name, quantity, price }],
        total,
        gst,
      });
    }

    return res.status(201).json(userInvoice);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const invoice = await Invoice.findOne({ user: req?.user._id });
    if (!invoice) {
      return res.json({
        success: true,
        products: {
          products: [],
          total: 0,
          gst: 0,
        },
      });
    }

    return res.json({ success: true, products: invoice });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const convertToPDF = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const invoice = await Invoice.findOne({ user: req?.user._id }).populate(
      "user",
      "name email"
    );

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found for this user" });
    }

    // Generate the HTML content for the invoice
    const htmlContent = generateInvoiceHTML(invoice);

    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
    });
    const page = await browser.newPage();

    // Set the content directly from HTML
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.setViewport({ width: 800, height: 1100 });

    const pdfDir = path.join(__dirname, "..", "public");
    const pdfPath = path.join(pdfDir, "invoice.pdf");

    // Create the directory if it does not exist
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Generate PDF and save it to a specific path
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // Ensure the file exists before sending
    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({ error: "PDF file not created" });
    }

    // Set the headers to send the PDF file
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${invoice._id}.pdf`,
      "Content-Length": fs.statSync(pdfPath).size,
    });
    res.sendFile(pdfPath);
  } catch (error) {
    console.error("PDF conversion error:", error);
    res.status(500).json({
      error: "Failed to generate invoice PDF",
      details: error,
    });
  }
};
