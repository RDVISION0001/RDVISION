import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../auth/AuthContext";
import axios from 'axios';

// Add the formatDate function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

function VerifiedSales() {
  const { roleName } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedCloser, setSelectedCloser] = useState("all");

  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    // Fetch exchange rate from USD to INR
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const rate = response.data.rates.INR;
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };
    fetchExchangeRate();
  }, []);

  const getFlagUrl = (countryIso) =>
    `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;


  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get("/invoice/getVerifiedInvoives");
        setInvoices(response.data);
      } catch (error) {
        setError(error.message || "An error occurred while fetching invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Handle customer modal
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

  // Get filtered invoices
  const getFilteredInvoices = () => {
    let filtered = invoices;
    switch (filter) {
      case "today":
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(todayStart.getDate() + 1);
        filtered = invoices.filter((invoice) => {
          const verificationDate = new Date(invoice.verificationDate);
          return verificationDate >= todayStart && verificationDate < tomorrowStart;
        });
        break;
      case "yesterday":
        const yesterdayStart = new Date(new Date().setDate(new Date().getDate() - 1));
        filtered = invoices.filter((invoice) => {
          const verificationDate = new Date(invoice.verificationDate);
          return verificationDate >= yesterdayStart && verificationDate < new Date();
        });
        break;
      case "parsho":
        const dayBeforeYesterdayStart = new Date(new Date().setDate(new Date().getDate() - 2));
        filtered = invoices.filter((invoice) => {
          const verificationDate = new Date(invoice.verificationDate);
          return verificationDate >= dayBeforeYesterdayStart && verificationDate < new Date();
        });
        break;
      default:
        break;
    }

    if (selectedCloser !== "all") {
      filtered = filtered.filter((invoice) => invoice.closerName === selectedCloser);
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
                  <tr className="warning">
                    <th className="py-2 text-nowrap" scope="col">Order Id </th>
                    <th scope="col" className="text-nowrap">Sale Date</th>
                    <th scope="col" className="text-nowrap">Verification Date</th>
                    <th scope="col">Closer </th>
                    <th scope="col">Customer </th>
                    <th scope="col">Street</th>
                    <th scope="col">City</th>
                    <th scope="col">State</th>
                    <th scope="col">Zip </th>
                    <th scope="col">Country</th>
                    <th scope="col" className="text-center">
                      Product Details
                    </th>
                    <th scope="col">Doses</th>
                    <th scope="col">Tracking No.</th>
                    <th scope="col" className="text-nowrap">Payment window</th>
                    <th scope="col" className="text-nowrap">Paid Amount</th>

                    {roleName === "SuperAdmin" && (
                      <>
                        <th scope="col" className="text-nowrap">Received Amount (INR) -7%</th>
                        <th scope="col" className="text-nowrap">Total Cost</th>
                        <th scope="col" className="text-nowrap">Profit</th>
                      </>
                    )}

                    {roleName === "admin" && <th scope="col">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    // Get the paid amount in USD
                    const paidAmountUSD = invoice.payment?.amount || 0;

                    // Decrease the received amount by 7% (if needed)
                    const receivedAmountUSD = paidAmountUSD * 0.93; // Same as decreasedPaidAmountUSD

                    // Convert the decreased received amount to INR
                    const receivedAmountINR = exchangeRate ? receivedAmountUSD * exchangeRate : 0;

                    return (
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
                        <td className="text-success bold-text">
                          {invoice.currency || "USD"} {invoice.payment?.amount}
                        </td>
                        {roleName === "SuperAdmin" && (
                          <>
                            {/* Display Received Amount after 7% decrease and converted to INR */}
                            <td className="text-success bold-text">
                              {receivedAmountINR ? `INR ${receivedAmountINR.toFixed(2)}` : "N/A"}
                            </td>
                            <td className="text-center">{invoice.totalCost || "N/A"}</td>
                            <td className="text-center">{invoice.profit || "N/A"}</td>
                          </>
                        )}

                        {roleName === "admin" && (
                          <td>
                            <Button
                              variant="success rounded"
                              onClick={() => handleVerifyInvoice(invoice.invoiceId)}
                            >
                              Next
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Modal */}
      <Modal show={showCustomerModal} onHide={handleCloseCustomerModal}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {selectedCustomer?.customerName}</p>
          <p><strong>Email:</strong> {selectedCustomer?.customerEmail}</p>
          <p><strong>Phone:</strong> {selectedCustomer?.customerMobile}</p>
          <p><strong>Ticket ID:</strong> {selectedCustomer?.ticketId}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCustomerModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VerifiedSales;

