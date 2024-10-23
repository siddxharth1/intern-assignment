import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { setToken } from "../store/authSlice";
import DownloadPDFInvoice from "../components/DownloadPDFInvoice";
import ProductTable from "../components/ProductTable";
import AddProductForm from "../components/AddProductForm";

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
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    products: [],
    total: 0,
    gst: 0,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [fetcing, setFetching] = useState(false);

  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (!savedToken) {
      navigate("/login");
    } else {
      dispatch(setToken(savedToken));
      getProducts(savedToken);
    }
    setLoading(false);
  }, [dispatch, navigate]);

  const getProducts = async (token: string) => {
    try {
      setFetching(true);
      const { data } = await axios.get(
        "https://intern-assignment-bpz2.onrender.com/api/invoices/products",
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
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Add Products</h1>
          <p className="text-gray-400">
            This is basic login page which is used for levitation assignment
            purpose.
          </p>
        </div>

        <AddProductForm setInvoiceData={setInvoiceData} />

        <ProductTable
          setInvoiceData={setInvoiceData}
          invoiceData={invoiceData}
          fetcing={fetcing}
        />

        <DownloadPDFInvoice />
      </div>
    </div>
  );
};

export default HomePage;
