import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

function Check({ data, datareload }) {
  const [product, setProduct] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [selectedItem, setSelectedItem] = useState();
  const [rate, setRate] = useState(selectedItem ? selectedItem.rate : null);
  const [totalgoodcost, setTotalGoodCost] = useState(
    selectedItem ? selectedItem.totalGoodsCost : null
  );
  const [shippingCharge, setShippingCharge] = useState(
    selectedItem ? selectedItem.shippingCharge : null
  );
  const [totalCost, setTotalCost] = useState(
    selectedItem ? selectedItem.totalCost : null
  );
  const [paid, setPaid] = useState(
    selectedItem ? selectedItem.paidAmount : null
  );
  const [due, setDue] = useState(selectedItem ? selectedItem.dueAmount : null);
  const { edit, setEdit } = useAuth(); // Track which field is being edited
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

  const handleDoubleClick = (field, value, item, index) => {
    if (selectedId === 0 || selectedId === item.id) {
      setSelectedId(item.id);
      setSelectedItem(item);
      setEdit(field);
      if (field === "rate") setRate(value);
      if (field === "totalGoodsCost") setTotalGoodCost(value);
      if (field === "shippingCharge") setShippingCharge(value);
      if (field === "totalCost") setTotalCost(value);
      if (field === "paid") setPaid(value);
      if (field === "due") setDue(value);
    } else {
      handleSave(index, selectedItem, field, item);
    }
  };

  const handleKeyDown = (event, index, item, field) => {
    if (event.key === "Tab") {
      event.preventDefault();
      moveToNextField(field, index, item);
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSave(index, item, field);
    }
  };

  const moveToNextField = (currentField, index, item) => {
    const fields = [
      "rate",
      "totalGoodsCost",
      "shippingCharge",
      "totalCost",
      "paid",
      "due",
    ];

    const currentIndex = fields.indexOf(currentField);
    const nextField = fields[(currentIndex + 1) % fields.length];

    handleDoubleClick(nextField, item[nextField], item, index);
  };

  const handleSave = async (index, item, filed, newItem) => {
    setEdit(false);
    const updatedData = {
      id: item.id,
      rate: rate !== null ? rate : item.rate,
      totalGoodsCost: totalgoodcost !== null ? totalgoodcost : item.totalGoodsCost,
      shippingCharge: shippingCharge !== null ? shippingCharge : item.shippingCharge,
      totalCost: totalCost !== null ? totalCost : item.totalCost,
      paidAmount: paid !== null ? paid : item.paidAmount,
      dueAmount: due !== null ? due : item.dueAmount,
      invoiceId: data.orderId,
    };

    // Check if the updated data is different from initial data
    if (JSON.stringify(updatedData) === JSON.stringify(initialData[index])) {
      toast.info("No changes detected.");
      setSelectedId(0);
      return; // No changes, no need to update
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        "/inventory/updateProductOrderDetails",
        updatedData
      );

      toast.success("Updated successfully");
      setLoading(false);

      const newInitialData = [...initialData];
      newInitialData[index] = updatedData;
      datareload();
      setInitialData(newInitialData);
      setRate(null);
      setDue(null);
      setPaid(null);
      setTotalGoodCost(null);
      setShippingCharge(null);
      setTotalCost(null);
      if (filed) {
        setEdit(filed);
        setSelectedId(item.id);
        setSelectedItem(item);
      } else {
        setSelectedId(0);
      }
    } catch (e) {
      toast.error("Some Error Occurred");
    }
  };

  return (
    <div>
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
                  width: "100px",
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
                  onDoubleClick={() =>
                    handleDoubleClick("rate", item.rate, item, index)
                  }
                >
                  {edit === "rate" && selectedId === item.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) => handleKeyDown(e, index, item, "rate")} // Attach to input
                    />
                  ) : selectedId === item.id && rate ? (
                    rate
                  ) : (
                    item.rate
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick(
                      "totalGoodsCost",
                      item.totalGoodsCost,
                      item,
                      index
                    )
                  }
                >
                  {edit === "totalGoodsCost" && selectedId === item.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={totalgoodcost}
                      onChange={(e) => setTotalGoodCost(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, item, "totalGoodsCost")
                      } // Attach to input
                    />
                  ) : selectedId === item.id && totalgoodcost ? (
                    totalgoodcost
                  ) : (
                    item.totalGoodsCost
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick(
                      "shippingCharge",
                      item.shippingCharge,
                      item,
                      index
                    )
                  }
                >
                  {edit === "shippingCharge" && selectedId === item.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={shippingCharge}
                      onChange={(e) => setShippingCharge(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, item, "shippingCharge")
                      } // Attach to input
                    />
                  ) : selectedId === item.id && shippingCharge ? (
                    shippingCharge
                  ) : (
                    item.shippingCharge
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick("totalCost", item.totalCost, item, index)
                  }
                >
                  {edit === "totalCost" && selectedId === item.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={totalCost}
                      onChange={(e) => setTotalCost(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, item, "totalCost")
                      } // Attach to input
                    />
                  ) : selectedId === item.id && totalCost ? (
                    totalCost
                  ) : (
                    item.totalCost
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick("paid", item.paidAmount, item, index)
                  }
                >
                  {edit === "paid" && selectedId === item.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={paid}
                      onChange={(e) => setPaid(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, item, "paid")
                      } // Attach to input
                    />
                  ) : selectedId === item.id && paid ? (
                    paid
                  ) : (
                    item.paidAmount
                  )}
                </td>
                <td
                  style={{ backgroundColor: "#f1faee" }}
                  className="border border-gray"
                  onDoubleClick={() =>
                    handleDoubleClick("due", item.dueAmount, item, index)
                  }
                >
                  {edit === "due" && selectedId === item.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={due}
                      onChange={(e) => setDue(e.target.value)}
                      style={{ width: "70px" }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, index, item, "due")
                      } // Attach to input
                    />
                  ) : selectedId === item.id && due ? (
                    due
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
                        style={{ height: 14, marginRight: 10 }}
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
                    style={{ width: "100px" }}
                    type="button" // Ensures the button doesn't submit a form
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent any default action like page reload
                      handleSave(index, item); // Your save handler
                    }}
                  >
                    {loading && selectedId === item.id ? (
                      <i class="fa-solid fa-sync fa-spin px-2"></i>
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
