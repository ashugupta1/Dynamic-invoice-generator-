"use client";
import "./globals.css";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

import InvoiceForm from "../components/InvoiceForm";

export default function Home() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div
        className="w-full max-w-[80vw] p-6 bg-white shadow-lg rounded-lg"
        ref={componentRef}
      >
        <InvoiceForm />
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handlePrint}
      >
        Print Invoice
      </button>
    </div>
  );
}
