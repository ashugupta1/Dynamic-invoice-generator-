import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import ReactToPrint from 'react-to-print';
import { jsPDF } from "jspdf";

// Validation schema using yup
const schema = yup.object().shape({
  invoiceNo: yup.string().required("Invoice Number is required"),
  dateOfIssue: yup.date().required("Issue Date is required"),
  dueDate: yup.date().required("Due Date is required"),
  currency: yup.string().required("Currency is required"),
  poNumber: yup.string().required("Purchase Order Number is required"),
  supplierName: yup.string().required("Supplier Name is required"),
  supplierGSTIN: yup.string().matches(/^[A-Z0-9]{15}$/, "Invalid GSTIN format"),
  supplierAddress: yup.string().required("Supplier Address is required"),
  customerName: yup.string().required("Customer Name is required"),
  customerGSTIN: yup.string().matches(/^[A-Z0-9]{15}$/, "Invalid GSTIN format"),
  customerAddress: yup.string().required("Customer Address is required"),
});

export default function TaxInvoiceForm({ref}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [items, setItems] = useState([]);
  const [totalTaxableAmount, setTotalTaxableAmount] = useState(0);
  const [totalInvoiceValue, setTotalInvoiceValue] = useState(0);
  const [showItemForm, setShowItemForm] = useState(false);
  // const componentRef = useRef();

  // Fields for the item being added
  const [serialNo, setSerialNo] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [rate, setRate] = useState(0);
  const [gstOption, setGstOption] = useState("18");
  const [description, setDescription] = useState("");

  const handleItemAdd = () => {
    const taxableAmount = quantity * rate;
    const gstPercentage = parseInt(gstOption);
    const tax = (taxableAmount * gstPercentage) / 100;
    const totalAmount = taxableAmount + tax;

    const newItem = {
      serialNo,
      description,
      hsnCode,
      quantity,
      rate,
      gstOption,
      taxableAmount,
      tax,
      totalAmount,
    };

    setItems([...items, newItem]);

    // Reset item fields after adding
    setSerialNo("");
    setDescription("");
    setHsnCode("");
    setQuantity(0);
    setRate(0);
    setGstOption("18");
    setShowItemForm(false);

    // Recalculate totals
    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    let totalTaxable = 0;
    let totalValue = 0;
    items.forEach((item) => {
      totalTaxable += item.taxableAmount;
      totalValue += item.totalAmount;
    });
    setTotalTaxableAmount(totalTaxable);
    setTotalInvoiceValue(totalValue);
  };

  const onSubmit = (data) => {
    console.log(data);
    // Handle submission logic like API calls here
  };

  return (
    <form
      onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))} ref={ref}
      className="max-w-[80vw] mx-auto p-8 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg space-y-6"
    >
      <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
        Tax Invoice Form
      </h2>

      {/* Basic Form Fields (like invoice number, customer details etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Invoice Number
          </label>
          <input
            {...register("invoiceNo")}
            className="input-field text-gray-900"
          />
          <p className="text-red-500 text-xs">{errors.invoiceNo?.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Issue
          </label>
          <input
            type="date"
            {...register("dateOfIssue")}
            className="input-field text-gray-900"
          />
          <p className="text-red-500 text-xs">{errors.dateOfIssue?.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className="input-field text-gray-900"
          />
          <p className="text-red-500 text-xs">{errors.dueDate?.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <input
            {...register("currency")}
            className="input-field text-gray-900"
          />
          <p className="text-red-500 text-xs">{errors.currency?.message}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Order Number
          </label>
          <input
            {...register("poNumber")}
            className="input-field text-gray-900"
          />
          <p className="text-red-500 text-xs">{errors.poNumber?.message}</p>
        </div>
      </div>

      {/* Supplier Details Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Supplier Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <input
              {...register("supplierName")}
              className="input-field text-gray-900"
            />
            <p className="text-red-500 text-xs">
              {errors.supplierName?.message}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier GSTIN
            </label>
            <input
              {...register("supplierGSTIN")}
              className="input-field text-gray-900"
            />
            <p className="text-red-500 text-xs">
              {errors.supplierGSTIN?.message}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier Address
            </label>
            <input
              {...register("supplierAddress")}
              className="input-field text-gray-900"
            />
            <p className="text-red-500 text-xs">
              {errors.supplierAddress?.message}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              {...register("customerName")}
              className="input-field text-gray-900"
            />
            <p className="text-red-500 text-xs">
              {errors.customerName?.message}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer GSTIN
            </label>
            <input
              {...register("customerGSTIN")}
              className="input-field text-gray-900"
            />
            <p className="text-red-500 text-xs">
              {errors.customerGSTIN?.message}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer Address
            </label>
            <input
              {...register("customerAddress")}
              className="input-field text-gray-900"
            />
            <p className="text-red-500 text-xs">
              {errors.customerAddress?.message}
            </p>
          </div>
        </div>
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={() => setShowItemForm(true)}
        className="mt-4 w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
      >
        Add Item
      </button>

      {/* Item Form for Adding an Item */}
      {showItemForm && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Add Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Serial Number
              </label>
              <input
                type="text"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                HSN/SAC Code
              </label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rate
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GST Rate (%)
              </label>
              <select
                value={gstOption}
                onChange={(e) => setGstOption(e.target.value)}
                className="input-field"
              >
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleItemAdd}
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Add Item
          </button>
        </div>
      )}

      {/* Items Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Items List</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-sm text-gray-700 bg-gray-200">
              <th className="p-2 border border-blue-400 text-blue-600">
                Serial No
              </th>
              <th className="p-2 border border-blue-400 text-blue-600">
                Description
              </th>
              <th className="p-2 border border-blue-400 text-blue-600">
                HSN/SAC
              </th>
              <th className="p-2 border border-blue-400 text-blue-600">
                Quantity
              </th>
              <th className="p-2 border border-blue-400 text-blue-600">Rate</th>
              <th className="p-2 border border-blue-400 text-blue-600">
                Taxable Amount
              </th>
              <th className="p-2 border border-blue-400 text-blue-600">GST</th>
              <th className="p-2 border border-blue-400 text-blue-600">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.serialNo}
                </td>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.description}
                </td>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.hsnCode}
                </td>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.quantity}
                </td>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.rate}
                </td>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.taxableAmount}
                </td>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.gstOption}%
                </td>
                <td className="p-2 border border-blue-300 text-gray-800">
                  {item.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-teal-600 mb-4">
          Invoice Summary
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">
              Total Taxable Amount:
            </span>
            <span className="font-semibold text-green-600">
              {totalTaxableAmount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">
              Total Invoice Value:
            </span>
            <span className="font-semibold text-green-600">
              {totalInvoiceValue}
            </span>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          onSubmit={onSubmit}
          className="w-1/3 bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Submit Invoice
        </button>
      </div>
      {/* <div>
      <ReactToPrint
        trigger={() => <button>Print Invoice</button>}
        content={() => componentRef.current}
      />
      </div> */}
    </form>
  );
}
