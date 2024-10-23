import { RootState } from "../store/store";
import axios from "axios";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useSelector } from "react-redux";

const DownloadPDFInvoice = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const getPdf = async () => {
    setGeneratingPdf(true);
    try {
      const response = await axios.get(
        "https://intern-assignment-bpz2.onrender.com/api/invoices/convert-pdf",
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
    } finally {
      setGeneratingPdf(false);
    }
  };
  return (
    <div className="w-full">
      <button
        onClick={getPdf}
        className="w-[80%] sm:w-[60%] lg:w-[40%] block mx-auto bg-[#2A2A2A] text-[#CCF575] py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-opacity-80 transition-colors"
      >
        {generatingPdf ? (
          <span className="flex gap-3 items-center justify-center">
            Generating PDF
            <span className="animate-spin text-lg sm:text-xl">
              <AiOutlineLoading />
            </span>
          </span>
        ) : (
          "Generate PDF Invoice"
        )}
      </button>
    </div>
  );
};

export default DownloadPDFInvoice;
