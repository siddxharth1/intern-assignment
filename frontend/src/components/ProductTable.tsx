import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import {
  FaArrowDownAZ,
  FaArrowDownShortWide,
  FaArrowDownWideShort,
  FaArrowUpZA,
} from "react-icons/fa6";
interface Product {
  name: string;
  price: number;
  quantity: number;
  _id: string;
}
const ProductTable = ({
  invoiceData,
  setInvoiceData,
  fetcing,
}: {
  invoiceData: { products: Product[]; total: number; gst: number };
  setInvoiceData: React.Dispatch<
    React.SetStateAction<{ products: Product[]; total: number; gst: number }>
  >;
  fetcing: boolean;
}) => {
  const [sortColumn, setSortColumn] = useState<keyof Product | "totalPrice">(
    "name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const sortData = (column: keyof Product | "totalPrice") => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setSortColumn(column);

    const sortedProducts = [...invoiceData.products].sort((a, b) => {
      let compareValueA =
        column === "totalPrice" ? a.price * a.quantity : a[column];
      let compareValueB =
        column === "totalPrice" ? b.price * b.quantity : b[column];

      if (
        typeof compareValueA === "string" &&
        typeof compareValueB === "string"
      ) {
        return newDirection === "asc"
          ? compareValueA.localeCompare(compareValueB)
          : compareValueB.localeCompare(compareValueA);
      } else {
        return newDirection === "asc"
          ? Number(compareValueA) - Number(compareValueB)
          : Number(compareValueB) - Number(compareValueA);
      }
    });

    setInvoiceData({ ...invoiceData, products: sortedProducts });
  };
  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden mb-6">
      <table className="w-full">
        <thead>
          <tr className="bg-white text-black">
            <th
              className="text-left px-6 py-3 cursor-pointer"
              onClick={() => sortData("name")}
            >
              <div className="flex items-center gap-2">
                <span>Product name</span>
                <span>
                  {sortColumn === "name" && sortDirection === "asc" ? (
                    <FaArrowDownAZ />
                  ) : (
                    <FaArrowUpZA />
                  )}
                </span>
              </div>
            </th>
            <th
              className="text-left px-6 py-3 cursor-pointer"
              onClick={() => sortData("quantity")}
            >
              <div className="flex items-center gap-2">
                <span>Quantity</span>
                <span>
                  {sortColumn === "quantity" && sortDirection === "asc" ? (
                    <FaArrowDownShortWide />
                  ) : (
                    <FaArrowDownWideShort />
                  )}
                </span>
              </div>
            </th>
            <th
              className="text-left px-6 py-3 cursor-pointer"
              onClick={() => sortData("price")}
            >
              <div className="flex items-center gap-2">
                <span>Price</span>
                <span>
                  {sortColumn === "price" && sortDirection === "asc" ? (
                    <FaArrowDownShortWide />
                  ) : (
                    <FaArrowDownWideShort />
                  )}
                </span>
              </div>
            </th>
            <th
              className="text-left px-6 py-3 cursor-pointer"
              onClick={() => sortData("totalPrice")}
            >
              Total Price
            </th>
          </tr>
        </thead>
        <tbody>
          {fetcing && (
            <tr>
              <td colSpan={4} className="py-4 sm:py-6 text-center">
                <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-3 sm:gap-4">
                  <span className="text-sm sm:text-base">Loading</span>
                  <span className="animate-spin text-xl sm:text-2xl">
                    <AiOutlineLoading />
                  </span>
                </div>
              </td>
            </tr>
          )}
          {invoiceData.products.map((product, index) => (
            <tr key={product._id || index} className="border-t border-gray-700">
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">{product.quantity}</td>
              <td className="px-6 py-4">{product.price}</td>
              <td className="px-6 py-4">
                $ {(product.price * product.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="border-t border-gray-700">
            <td></td>
            <td></td>
            <td className="px-6 py-4 ">+GST 18%</td>
            <td className="px-6 py-4">
              $ {invoiceData.total + invoiceData.gst}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
