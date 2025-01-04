import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

function Check({ data }) {
  const [product, setProduct] = useState([]);
  const [rate, setRate] = useState(null);
  const [totalgoodcost, setTotalGoodCost] = useState(null);
  const [shippingCharge, setShippingCharge] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [paid, setPaid] = useState(null);
  const [due, setDue] = useState(null);
  const [edit, setEdit] = useState(false); // Track which field is being edited
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data.orderDetails) {
      setProduct(data.orderDetails);
      // Initialize the initial data to compare changes
      const initialValues = data.orderDetails.map((item) => ({
        id: item.id,
        rate: item.rate,
        totalGoodsCost: item.totalGoodsCost,
        shippingCharge: item.shippingCharge,
        totalCost: item.totalCost,
        paidAmount: item.paidAmount,
        dueAmount: item.dueAmount,
      }));
      setInitialData(initialValues);
    }
  }, [data]);

  const handleDoubleClick = (field, value) => {
    setEdit(field);
    if (field === "rate") setRate(value);
    if (field === "totalGoodsCost") setTotalGoodCost(value);
    if (field === "shippingCharge") setShippingCharge(value);
    if (field === "totalCost") setTotalCost(value);
    if (field === "paid") setPaid(value);
    if (field === "due") setDue(value);
  };

  const handleKeyDown = (event, index, item) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleSave(index, item); // Call save on Enter key
    }
  };

  const handleSave = async (index, item) => {
    setEdit(false);
    const updatedData = {
      id: item.id,
      rate: rate !== null ? rate : item.rate,
      totalGoodsCost:
        totalgoodcost !== null ? totalgoodcost : item.totalGoodsCost,
      shippingCharge:
        shippingCharge !== null ? shippingCharge : item.shippingCharge,
      totalCost: totalCost !== null ? totalCost : item.totalCost,
      paidAmount: paid !== null ? paid : item.paidAmount,
      dueAmount: due !== null ? due : item.dueAmount,
    };

    // Check if the updated data is different from initial data
    if (JSON.stringify(updatedData) === JSON.stringify(initialData[index])) {
      toast.info("No changes detected.");
      return; // No changes, no need to update
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        "/inventory/updateProductOrderDetails",
        updatedData
      );
      console.log(response);
      toast.success("Updated");
      window.location.reload();
      setLoading(false);
      const newInitialData = [...initialData];
      newInitialData[index] = updatedData;
      setInitialData(newInitialData);
    } catch (e) {
      toast.error("Some Error Occurred");
    }
  };

  return (
    <div className="container-fluid mt-1">
      {product.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Rate
              </th>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Total good Cost
              </th>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Shipping charge
              </th>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Total cost
              </th>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Paid Amount
              </th>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Due Amount
              </th>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Payment Status
              </th>
              <th
                style={{
                  backgroundColor: "#f5cac3",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {product.map((item, index) => (
              <tr key={index}>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() => handleDoubleClick("rate", item.rate)}
                >
                  {edit === "rate" ? (
                    <input
                      type="text"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) => handleKeyDown(e, index, item)} // Attach to input
                    />
                  ) : (
                    item.rate
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick("totalGoodsCost", item.totalGoodsCost)
                  }
                >
                  {edit === "totalGoodsCost" ? (
                    <input
                      type="text"
                      value={totalgoodcost}
                      onChange={(e) => setTotalGoodCost(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) => handleKeyDown(e, index, item)} // Attach to input
                    />
                  ) : (
                    item.totalGoodsCost
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick("shippingCharge", item.shippingCharge)
                  }
                >
                  {edit === "shippingCharge" ? (
                    <input
                      type="text"
                      value={shippingCharge}
                      onChange={(e) => setShippingCharge(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) => handleKeyDown(e, index, item)} // Attach to input
                    />
                  ) : (
                    item.shippingCharge
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick("totalCost", item.totalCost)
                  }
                >
                  {edit === "totalCost" ? (
                    <input
                      type="text"
                      value={totalCost}
                      onChange={(e) => setTotalCost(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) => handleKeyDown(e, index, item)} // Attach to input
                    />
                  ) : (
                    item.totalCost
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick("paid", item.paidAmount)
                  }
                >
                  {edit === "paid" ? (
                    <input
                      type="text"
                      value={paid}
                      onChange={(e) => setPaid(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) => handleKeyDown(e, index, item)} // Attach to input
                    />
                  ) : (
                    item.paidAmount
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() => handleDoubleClick("due", item.dueAmount)}
                >
                  {edit === "due" ? (
                    <input
                      type="text"
                      value={due}
                      onChange={(e) => setDue(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) => handleKeyDown(e, index, item)} // Attach to input
                    />
                  ) : (
                    item.dueAmount
                  )}
                </td>

                <td style={{ backgroundColor: "#f1faee" }}>
                  {item.dueAmount > 0 ? (
                    "Payment Due"
                  ) : (
                    <>
                      <img
                        style={{ height: 14 , marginRight:10 }}
                        src="https://cdn-icons-png.flaticon.com/128/5610/5610944.png"
                        alt="Paid"
                      />
                      Paid
                    </>
                  )}
                </td>

                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                >
                  <button
                    type="button" // Ensures the button doesn't submit a form
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent any default action like page reload
                      handleSave(index, item); // Your save handler
                    }}
                  >
                    {loading ? (
                      <i class="fa-solid fa-sync fa-spin"></i>
                    ) : (
                      "Save"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No product details available.</p>
      )}
    </div>
  );
}

export default Check;
