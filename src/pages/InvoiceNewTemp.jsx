import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../auth/AuthContext";
// Toast notification
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-bootstrap";
import AddressForm from "../components/AddressForm";

function InvoiceNewTemp() {
  const [invoices, setInvoices] = useState([]); // State to store invoice data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { userId, dark } = useAuth();
  const [addressFrom, setAddressForm] = useState(false);
  const [ticketId, setTicketId] = useState();
  const [cpoy, setCopy] = useState(false);

  // State to store the dropdown options
  const [options, setOptions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // State to store selected invoice
  const [formData, setFormData] = useState({
    transectionid: "",
    amount: "",
    currency: "USD", // Default currency
    paymentWindow: "",
    userId,
    uniqueQueryId: "", // Added uniqueQueryId to the formData
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/invoice/processPayment",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("Payment processed successfully!");
    } catch (error) {
      console.error("Error:", error.response || error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsModalOpen(false);
      fetchInvoices();
    }
  };
  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get(
        `/invoice/getInvoiceByUser/${userId}`
      );
      setInvoices(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch invoices. Please try again.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, [userId]);

  // Format date to 15Nov_2024
  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = new Date(date)
      .toLocaleDateString("en-US", options)
      .replace(/ /g, "");
    return formattedDate.replace(",", "_");
  };

  // Handle Mark Paid button click
  const handleMarkAsPaidClick = (invoice) => {
    setSelectedInvoice(invoice); // Set selected invoice
    setFormData({ ...formData, uniqueQueryId: invoice.uniqueQueryId }); // Set uniqueQueryId in the form
    setIsModalOpen(true); // Open modal
  };

  // Calculations for cards
  const totalPaidAmount = invoices
    .filter((invoice) => invoice.paymentStatus === "paid")
    .reduce((sum, invoice) => sum + (invoice.orderAmount || 0), 0);

  const totalPaidInvoices = invoices.filter(
    (invoice) => invoice.paymentStatus === "paid"
  ).length;

  const totalPendingAmount = invoices
    .filter((invoice) => invoice.paymentStatus !== "paid")
    .reduce((sum, invoice) => sum + (invoice.orderAmount || 0), 0);

  const totalPendingInvoices = invoices.filter(
    (invoice) => invoice.paymentStatus !== "paid"
  ).length;

  useEffect(() => {
    // Call the API on component mount
    axiosInstance
      .get("/paymentwindow/getAll")
      .then((response) => {
        setOptions(response.data); // Assuming the response data is an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payment windows:", error);
        setLoading(false);
      });
  }, []);

  const openModel = (ticketId) => {
    setTicketId(ticketId);
    setAddressForm(true);
  };

  return (
    <>
      {/* card section (unchanged) */}
      <section
        className={`sadmin-top-section py-3 ${dark ? `bg-dark` : "bg-white"} `}
      >
        <div className="container-fluid">
          <div className="row justify-content-center">
            {/* Total Paid Amount Card */}
            <div className="col-md-3 col-sm-6 col-12">
              <div
                className="card border shadow text-dark "
                style={{
                  width: "100%", // Make the card full width on small screens
                  height: "100px",
                  borderRadius: "10px",
                  backgroundColor: dark ? "#000" : "#A8E6CF", // Green background if dark is true, else default color
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  className={`card-body d-flex align-items-center justify-content-center ${dark ? " text-white" : ""
                    }`}
                >
                  <div>
                    <i
                      className="fas fa-dollar-sign"
                      style={{
                        fontSize: "3rem",
                        marginRight: "10px",
                        color: dark ? "#FFEB3B" : "#4CAF50", // Adjust icon color based on dark mode
                      }}
                    ></i>
                  </div>
                  <div>
                    <p className="card-title fw-bold">Total Paid Amount</p>
                    <h5 className="font-weight-bold">
                      {loading
                        ? "Loading..."
                        : `${totalPaidAmount.toFixed(2)} USD`}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Paid Invoices Card */}
            <div className="col-md-3 col-sm-6 col-12">
              <div
                className="card border shadow text-dark"
                style={{
                  width: "100%", // Ensure card takes full width on smaller screens
                  height: "100px",
                  borderRadius: "10px",
                  backgroundColor: dark ? "#000000" : "#FFCDD2",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  className={`card-body d-flex align-items-center justify-content-center ${dark ? " text-white" : ""
                    }`}
                >
                  <div>
                    <i
                      className="fas fa-check-circle"
                      style={{
                        fontSize: "3rem",
                        marginRight: "10px",
                        color: "#FF5722",
                      }}
                    ></i>
                  </div>
                  <div>
                    <p className="card-title fw-bold">Total Paid Invoices</p>
                    <h5 className="font-weight-bold">
                      {loading ? "Loading..." : `${totalPaidInvoices}`}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Pending Amount Card */}
            <div className="col-md-3 col-sm-6 col-12">
              <div
                className="card border shadow text-dark"
                style={{
                  width: "100%", // Make the card full width on smaller screens
                  height: "100px",
                  borderRadius: "10px",
                  backgroundColor: dark ? "#000000" : "#FFEB3B",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  className={`card-body d-flex align-items-center justify-content-center ${dark ? " text-white" : ""
                    }`}
                >
                  <div>
                    <i
                      className="fas fa-clock"
                      style={{
                        fontSize: "3rem",
                        marginRight: "10px",
                        color: "#FF9800",
                      }}
                    ></i>
                  </div>
                  <div>
                    <p className="card-title fw-bold">Total Pending Amount</p>
                    <h5 className="font-weight-bold">
                      {loading
                        ? "Loading..."
                        : `${totalPendingAmount.toFixed(2)} USD`}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Pending Invoices Card */}
            <div className="col-md-3 col-sm-6 col-12">
              <div
                className="card border shadow text-dark"
                style={{
                  width: "100%", // Ensure card takes full width on smaller screens
                  height: "100px",
                  borderRadius: "10px",
                  backgroundColor: dark ? "#000" : "#D1C4E9",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  className={`card-body d-flex align-items-center justify-content-center ${dark ? " text-white" : ""
                    }`}
                >
                  <div>
                    <i
                      className="fas fa-exclamation-circle"
                      style={{
                        fontSize: "3rem",
                        marginRight: "10px",
                        color: "#9C27B0",
                      }}
                    ></i>
                  </div>
                  <div>
                    <p className="card-title fw-bold">Total Pending Invoices</p>
                    <h5 className="font-weight-bold">
                      {loading ? "Loading..." : `${totalPendingInvoices}`}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* table section */}
      <section
        className={`followup-table-section py-2 d-flex ${dark ? `bg-dark` : `bg-white`
          } `}
      >
        <div className="container-fluid">
          <div
            className={`table-wrapper tabbed-table ${dark ? `bg-dark` : `bg-white`
              }`}
          >
            <h5 className={` ${dark ? `text-light` : `text-dark`}`}>
              Invoices
            </h5>
            {loading ? (
              <p>Loading invoices...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <div
                className="table-responsive "
                style={{ maxHeight: "100%" }}
              >
                <table
                  className={`table table-bordered w-100 ${dark ? "bg-dark text-light" : ""
                    }`}
                >
                  <thead
                    className={`sticky-top ${dark ? "bg-dark text-light" : ""}`}
                  >
                    <tr>
                      <th scope="col" style={{ fontSize: 13 }}>
                        S.No
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Closer
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Sale Date
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Customer Name
                      </th>
                      <th
                        scope="col"
                        className={`text-center ${dark ? "text-dark" : ""}`}
                        style={{ fontSize: 13 }}
                      >
                        Product Details
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Invoice Generate Date
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Order Amount
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Payment Status
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Seen
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        IP Address
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Verification Status
                      </th>
                      <th scope="col" style={{ fontSize: 13 }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    style={{ height: 500, overflowY: "scroll" }}
                    className={`${dark ? "bg-dark text-light" : ""}`}
                  >
                    {invoices
                      .slice()
                      .map((invoice, index) => (
                        <tr
                          key={invoice.invoiceId}
                          className={`${dark
                            ? "table-dark"
                            : invoice.opened === "paid"
                              ? "table-danger"
                              : "table-success"
                            } ${dark ? "bg-dark text-light" : ""}`}
                        >

                          <td>{index + 1}</td>
                          <td style={{ fontSize: 13 }}>{invoice.closerName}</td>
                          <td style={{ fontSize: 13 }}>
                            {formatDate(invoice.saleDate)}
                          </td>
                          <td style={{ fontSize: 13 }}>
                            {invoice.customerName}
                          </td>
                          <td
                            className={`text-center ${dark ? "text-light" : ""
                              }`}
                          >
                            {/* Product Details Section - Nested Table */}
                            <table
                              className={`table table-bordered w-100 ${dark ? "bg-dark text-light" : ""
                                }`}
                            >
                              <thead>
                                <tr>
                                  <th
                                    className="px-3"
                                    style={{ fontWeight: 500, fontSize: 13 }}
                                  >
                                    Name
                                  </th>
                                  <th
                                    className="px-3"
                                    style={{ fontWeight: 500, fontSize: 13 }}
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    className="px-3"
                                    style={{ fontWeight: 500, fontSize: 13 }}
                                  >
                                    Price
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoice.orderDto.productOrders.map(
                                  (order, i) =>
                                    order.product?.map((product, index) => (
                                      <tr key={`${i}-${index}`}>
                                        <td
                                          className={`border ${dark ? `bg-dark text-light` : ""}`}
                                          style={{ fontSize: 12 }}
                                        >
                                          {product.name}
                                        </td>
                                        <td
                                          className={`border ${dark ? `bg-dark text-light` : ""}`}
                                          style={{ fontSize: 12 }}
                                        >
                                          {order.quantity || "N/A"}
                                        </td>
                                        <td
                                          className={`border ${dark ? `bg-dark text-light` : "bg-white"}`}
                                          style={{ fontSize: 12 }}
                                        >
                                          {order.currency}{" "}
                                          {order.totalAmount || "N/A"}
                                        </td>
                                      </tr>
                                    ))
                                )}
                              </tbody>
                            </table>
                          </td>
                          <td style={{ fontSize: 13 }}>
                            {formatDate(invoice.invoiceCreateDate)}
                          </td>
                          <td
                            className={`text-success font-weight-bold ${dark ? "text-light" : ""
                              }`}
                            style={{ fontSize: 13 }}
                          >
                            {invoice.currency || "USD"} {invoice.orderAmount}
                          </td>
                          <td
                            style={{ fontSize: 13 }}
                            className={
                              invoice.paymentStatus === "paid"
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {invoice.paymentStatus || "Pending"}
                          </td>
                          <td
                            className={
                              invoice.opened === "paid"
                                ? "text-success font-weight-bold"
                                : "text-danger"
                            }
                          >
                            {invoice.opened ? (
                              <i
                                className="fa-solid fa-check-double fa-xl"
                                style={{ color: "#05a836" }}
                              ></i>
                            ) : (
                              <i
                                className="fa-solid fa-check-double fa-xl"
                                style={{ color: "#58595a" }}
                              ></i>
                            )}
                          </td>
                          <td style={{ fontSize: 13 }}>
                            {invoice.ipAddress
                              ? invoice.ipAddress.slice(0, 13)
                              : "Not Opened Yet"}
                          </td>
                          <td
                            className={
                              invoice.verificationDate
                                ? "text-success font-weight-bold"
                                : "text-danger text-center"
                            }
                          >
                            {invoice.verificationDate ? (
                              <i
                                className="fa-solid fa-circle-check fa-xl"
                                style={{ color: "#2f850a" }}
                              ></i>
                            ) : (
                              <i
                                className="fa-solid fa-hourglass-half fa-xl"
                                style={{ color: "#ff3838" }}
                              ></i>
                            )}
                          </td>
                          <td>
                            {invoice.paymentStatus !== "paid" && (
                              <button
                                className={`btn btn-success rounded ${dark ? "text-light" : ""
                                  }`}
                                onClick={() =>
                                  invoice.address
                                    ? handleMarkAsPaidClick(invoice)
                                    : openModel(invoice.uniqueQueryId)
                                }
                              >
                                {invoice.address ? "Mark Paid" : "Add Address"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* mark as paid Modal */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          id="addTicketModal"
          tabIndex="-1"
          aria-labelledby="addTicketModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title" id="addTicketModalLabel">
                  Mark as Paid
                </h5>
                <button
                  type="button"
                  className="btn-close text-white"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="transectionid" className="form-label">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      id="transectionid"
                      className="form-control"
                      name="transectionid"
                      value={formData.transectionid}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount
                    </label>
                    <input
                      type="text"
                      id="amount"
                      className="form-control"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="paymentWindow" className="form-label">
                      Payment Window
                    </label>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <select
                        id="paymentWindow"
                        name="paymentWindow"
                        className="form-control"
                        value={formData.paymentWindow}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Payment Window</option>
                        {options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.paymentWindowName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="currency" className="form-label">
                      Currency
                    </label>
                    <select
                      id="currency"
                      className="form-select"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Currency</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Mark as Paid
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={addressFrom}
        onHide={fetchInvoices}
        className="modal assign-ticket-modal fade "
        id="addMoreItemsModal"
        tabindex="-1"
        aria-labelledby="addMoreItemsLabel"
        aria-hidden="true"
      >
        <div className="d-flex justify-content-center">
          <AddressForm
            ticketId={ticketId}
            close={() => setAddressForm(false)}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            style={{ maxWidth: "70px" }}
            onClick={() => setAddressForm(false)}
          >
            close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default InvoiceNewTemp;
