import mongoose, { Schema, Document } from "mongoose";

export interface IProduct {
  name: string;
  quantity: number;
  price: number;
}

export interface IInvoice extends Document {
  user: mongoose.Schema.Types.ObjectId;
  products: IProduct[];
  total: number;
  gst: number;
  date: Date;
}

const invoiceSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  gst: { type: Number, required: true },
});

const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);
export default Invoice;
