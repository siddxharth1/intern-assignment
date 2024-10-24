import axios from "axios";
import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Product {
  name: string;
  price: number;
  quantity: number;
  _id: string;
}

const AddProductForm = ({
  setInvoiceData,
}: {
  setInvoiceData: React.Dispatch<
    React.SetStateAction<{ products: Product[]; total: number; gst: number }>
  >;
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [addingData, setAddingData] = useState(false);
  const [error, setError] = useState("");

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message
    setAddingData(true);

    // Basic validation
    if (!name.trim()) {
      setError("Product name is required.");
      setAddingData(false);
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Please enter a valid price greater than 0.");
      setAddingData(false);
      return;
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      setAddingData(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://intern-assignment-bpz2.onrender.com/api/invoices/add-product",
        {
          name,
          price: Number(price),
          quantity: Number(quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setInvoiceData({
          products: response.data.products || [],
          total: response.data.total || 0,
          gst: response.data.gst || 0,
        });
      }

      // Clear input fields
      setName("");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.error("Failed to add product", error);
    } finally {
      setAddingData(false);
    }
  };

  return (
    <form onSubmit={handleAddProduct}>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the product name"
            required
            className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter the price in $"
            required
            className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter the Qty"
            required
            className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={addingData}
        className="bg-[#2A2A2A] text-[#CCF575] px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-80 transition-colors mb-8"
      >
        {addingData ? (
          <span className="flex gap-3 items-center">
            Adding Product...
            <span className="animate-spin">
              <AiOutlineLoading />
            </span>
          </span>
        ) : (
          <span className="flex gap-3 items-center">
            Add Product
            <span>
              <IoAddCircleOutline />
            </span>
          </span>
        )}
      </button>
    </form>
  );
};

export default AddProductForm;
