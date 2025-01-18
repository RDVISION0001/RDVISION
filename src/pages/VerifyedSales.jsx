import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../auth/AuthContext";

function VerifiedSales() {
  const { roleName } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedCloser, setSelectedCloser] = useState("all"); // New state for closerName filter

  const handleCloseCustomerModal = () => setShowCustomerModal(false);
  const handleShowCustomerModal = (invoice) => {
    setSelectedCustomer({
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      customerMobile: invoice.customerMobile,
      ticketId: invoice.orderDto?.ticketId || "N/A",
    });
    setShowCustomerModal(true);
  };

  const getFlagUrl = (countryIso) =>
    `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(
          "/invoice/getVerifiedInvoives"
        );
        setInvoices(response.data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // API call to verify invoice
  const handleVerifyInvoice = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(
        `/invoice/verifyInvoiceByAdmin/${invoiceId}`
      );
      toast.success(response.data.message || "Invoice verified successfully!", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify invoice", {
        autoClose: 3000,
      });
    }
  };

  // Filter invoices based on verificationDate
  const getFilteredInvoices = () => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);
    const dayBeforeYesterdayStart = new Date(todayStart);
    dayBeforeYesterdayStart.setDate(todayStart.getDate() - 2);

    let filtered = invoices;

    switch (filter) {
      case "today":
        filtered = invoices.filter((invoice) => {
          const verificationDate = new Date(invoice.verificationDate);
          return (
            verificationDate >= todayStart && verificationDate < tomorrowStart
          );
        });
        break;
      case "yesterday":
        filtered = invoices.filter((invoice) => {
          const verificationDate = new Date(invoice.verificationDate);
          return (
            verificationDate >= yesterdayStart && verificationDate < todayStart
          );
        });
        break;
      case "parsho":
        filtered = invoices.filter((invoice) => {
          const verificationDate = new Date(invoice.verificationDate);
          return (
            verificationDate >= dayBeforeYesterdayStart &&
            verificationDate < yesterdayStart
          );
        });
        break;
      default:
        break;
    }

    // Filter by closerName if selectedCloser is not "all"
    if (selectedCloser !== "all") {
      filtered = filtered.filter(
        (invoice) => invoice.closerName === selectedCloser
      );
    }

    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  // Get unique closer names for the dropdown
  const uniqueClosers = [
    "all",
    ...new Set(invoices.map((invoice) => invoice.closerName)),
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <section className="followup-table-section ">
        <div className="container-fluid">
          <div className="" style={{ marginTop: 5 }}>
            <h3 className="title mb-1 mt-4">
              {roleName?.toLowerCase() === "SuperAdmin" ? "RD Vision Sale sheet" : "Verified Sales"}
            </h3>

            {/* Filter Buttons */}
            <div className="mb-3 d-flex justify-content-between">
              <div>
                <Button
                  variant={filter === "today" ? "primary" : "outline-primary"}
                  onClick={() => setFilter("today")}
                  className="btn-lg"
                >
                  Today
                </Button>
                <Button
                  variant={filter === "yesterday" ? "primary" : "outline-primary"}
                  onClick={() => setFilter("yesterday")}
                  className="btn-lg"
                >
                  Yesterday
                </Button>
                <Button
                  variant={filter === "parsho" ? "primary" : "outline-primary"}
                  onClick={() => setFilter("parsho")}
                  className="btn-lg"
                >
                  Day Before Yesterday
                </Button>
                <Button
                  variant={filter === "all" ? "primary" : "outline-primary"}
                  onClick={() => setFilter("all")}
                  className="btn-lg"
                >
                  All
                </Button>
              </div>

              {/* Dropdown Filter for Closer */}
              <div style={{ zIndex: 1025, position: "relative" }}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" id="closer-filter">
                    {selectedCloser === "all"
                      ? "All Closers"
                      : `Closer: ${selectedCloser}`}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {uniqueClosers.map((closer) => (
                      <Dropdown.Item
                        key={closer}
                        onClick={() => setSelectedCloser(closer)}
                      >
                        {closer === "all" ? "All Closers" : closer}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="followups-table table-responsive table-height">
              <table
                className="table table-bordered table-hover table-striped table-sm"
                style={{ maxHeight: "200px" }}
              >
                <thead
                  className="text-white sticky-top "
                  style={{ backgroundColor: "#343a40", }}
                >
                  <tr className="">
                    {/* <th scope="col">Ser n.</th> */}
                    <th className="py-2 text-nowrap" scope="col">Order Id </th>
                    <th scope="col" className="text-nowrap">Sale Date</th>
                    <th scope="col" className="text-nowrap">Verification Date</th>
                    <th scope="col">Closer </th>
                    <th scope="col">Customer </th>
                    {/* <th scope="col">Customer Email</th> */}
                    <th scope="col">Street</th>
                    <th scope="col">City</th>
                    <th scope="col">State</th>
                    <th scope="col">Zip </th>
                    <th scope="col">Country</th>
                    <th scope="col" className="text-center">
                      Product Details{" "}
                    </th>
                    <th scope="col">Doses</th>
                    <th scope="col">Tracking No.</th>
                    <th scope="col" className="text-nowrap">Payment window</th>
                    {/* <th scope="col">Shipping Through</th> */}
                    <th scope="col" className="text-nowrap">Paid Amount</th>

                    {roleName === "SuperAdmin" && (
                      <>
                        <th scope="col" className="text-nowrap">Received Amount (INR)</th>
                        <th scope="col" className="text-nowrap">Total Cost</th>
                        <th scope="col" className="text-nowrap">Profit</th>
                      </>
                    )}

                    {roleName === "admin" && <th scope="col">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.invoiceId}
                      className={invoice.trackingNumber ? "table-success" : ""}
                    >

                      <td>{invoice.invoiceId || "N/A"}</td>
                      <td className="text-nowrap">{formatDate(invoice.saleDate)}</td>
                      <td>{formatDate(invoice.verificationDate)}</td>
                      <td>{invoice.closerName}</td>
                      <td>{invoice.customerName}</td>
                      <td>{invoice.address?.landmark || "N/A"}</td>
                      <td>{invoice.address?.city || "N/A"}</td>
                      <td>{invoice.address?.state || "N/A"}</td>
                      <td>{invoice.address?.zipCode || "N/A"}</td>
                      <td>
                        <img
                          style={{ height: 12 }}
                          src={getFlagUrl(invoice.countryIso)}
                          alt=""
                        />{" "}
                        {invoice.countryIso}
                      </td>
                      <td className="text-center">
                        <table className="table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{ width: "200px", fontSize: 13 }}
                                className="px-4 border border-dark"
                              >
                                Name
                              </th>
                              <th
                                style={{ width: "100px", fontSize: 13 }}
                                className="px-3 border border-dark"
                              >
                                Quantity
                              </th>
                              <th
                                style={{ width: "150px", fontSize: 13 }}
                                className="px-3 border border-dark"
                              >
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.orderDto.productOrders.map((order, i) =>
                              order.product?.map((product, index) => (
                                <tr
                                  key={`${i}-${index}`}
                                  className="table table-bordered"
                                >
                                  <td
                                    className="border border-dark p-1"
                                    style={{ fontSize: 12 }}
                                  >
                                    {product.name}
                                  </td>
                                  <td
                                    className="border border-dark p-1"
                                    style={{ fontSize: 12 }}
                                  >
                                    {order.quantity || "N/A"}
                                  </td>
                                  <td
                                    className="border border-dark p-1"
                                    style={{ fontSize: 12 }}
                                  >
                                    {invoice.currency}
                                    {order.totalAmount || "N/A"}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </td>
                      <td className="text-center">
                        {invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}
                      </td>
                      <td className="text-center">{invoice.trackingNumber || "N/A"}</td>
                      <td>{invoice.payment?.paymentWindow || "N/A"}</td>
                      {/* <td><button>Add</button></td> */}
                      <td className="text-success bold-text">
                        {invoice.currency || "USD"} {invoice.payment?.amount}
                      </td>
                      {roleName === "admin" && (
                        <td>
                          (
                          <Button
                            variant="success rounded"
                            onClick={() => handleVerifyInvoice(invoice.invoiceId)}
                          >
                            Next
                          </Button>
                          )
                        </td>
                      )}
                      {roleName === "SuperAdmin" && (
                        <>
                          <td className="text-center">need to convert</td>
                          <td className="text-center">{invoice.totalCost || "N/A"}</td>
                          <td className="text-center">{invoice.profit || "N/A"}</td>
                        </>
                      )}

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Details Modal */}
      <Modal
        show={showCustomerModal}
        onHide={handleCloseCustomerModal}
        centered
      >
        <div
          className="modal-header"
          style={{
            backgroundColor: "#5f6368",
            color: "#fff",
            borderBottom: "2px solid #ccc",
          }}
        >
          <h5
            className="modal-title w-100 text-center"
            style={{ fontWeight: "bold", fontSize: "1.25rem" }}
          >
            Customer Details
          </h5>
          <button
            type="button"
            className="close"
            onClick={handleCloseCustomerModal}
            style={{ color: "#fff" }}
          >
            &times;
          </button>
        </div>
        <div
          className="modal-body"
          style={{ backgroundColor: "#f4f7fa", color: "#333" }}
        >
          {selectedCustomer ? (
            <div>
              <p>
                <strong>Name:</strong>{" "}
                <span className="text-muted">
                  {selectedCustomer.customerName}
                </span>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span className="text-muted">
                  {selectedCustomer.customerEmail}
                </span>
              </p>
              <p>
                <strong>Mobile:</strong>{" "}
                <span className="text-muted">
                  {selectedCustomer.customerMobile}
                </span>
              </p>
              <p>
                <strong>Ticket ID:</strong>{" "}
                <span className="text-muted">{selectedCustomer.ticketId}</span>
              </p>
            </div>
          ) : (
            <p className="text-info">Loading customer details...</p>
          )}
        </div>
        <div
          className="modal-footer justify-content-center"
          style={{ borderTop: "2px solid #ccc" }}
        >
          <button
            className="btn btn-secondary"
            onClick={handleCloseCustomerModal}
            style={{ fontWeight: "bold" }}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(",", ""); // Removes the comma if it appears
};

export default VerifiedSales;

