import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store/store";
import { setToken } from "../store/authSlice";

interface Product {
  name: string;
  price: number;
  quantity: number;
  _id: string;
}

interface InvoiceData {
  products: Product[];
  total: number;
  gst: number;
}

const HomePage: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    products: [],
    total: 0,
    gst: 0,
  });
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (!savedToken) {
      navigate("/login");
    } else {
      dispatch(setToken(savedToken));
      verifyToken(savedToken);
    }
    setLoading(false);
  }, [dispatch, navigate]);

  const verifyToken = async (token: string) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/invoices/products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success && data.products) {
        setInvoiceData({
          products: data.products.products || [],
          total: data.products.total || 0,
          gst: data.products.gst || 0,
        });
      }
    } catch (error) {
      Cookies.remove("token");
      navigate("/login");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/invoices/add-product",
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

      setName("");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const getPdf = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/invoices/convert-pdf",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // This is crucial for binary files
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice.pdf`);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Add Products</h1>
          <p className="text-gray-400">
            This is basic login page which is used for levitation assignment
            purpose.
          </p>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the product name"
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
              placeholder="Enter the price"
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
              className="w-full p-3 rounded-lg bg-[#1F1F1F] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#CCF575]"
            />
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="bg-[#2A2A2A] text-[#CCF575] px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-80 transition-colors mb-8"
        >
          Add Product
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* Products Table */}
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-white text-black">
                <th className="text-left px-6 py-3">Product name</th>
                <th className="text-left px-6 py-3">Quantity</th>
                <th className="text-left px-6 py-3">Price</th>
                <th className="text-left px-6 py-3">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.products.map((product, index) => (
                <tr
                  key={product._id || index}
                  className="border-t border-gray-700"
                >
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">
                    INR {(product.price * product.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-700">
                <td colSpan={3} className="px-6 py-4 text-right">
                  +GST 18%
                </td>
                <td className="px-6 py-4">INR {invoiceData.gst.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Generate PDF Button */}
        <div className="w-full ">
          <button
            onClick={getPdf}
            className="w-[40%] block mx-auto bg-[#2A2A2A] text-[#CCF575] py-3 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Generate PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;