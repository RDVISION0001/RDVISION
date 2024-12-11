import React, { useState, useEffect } from "react";
import { Tabs, Tab, Table, InputGroup, FormControl } from "react-bootstrap";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is configured
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const Index = () => {
  const [activeTab, setActiveTab] = useState("totalticket");
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [todayTickets, setTodayTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [todayInvoices, setTodayInvoices] = useState([]);


  // Fetch data when the tab changes
  useEffect(() => {
    if (activeTab === "totalticket") {
      axiosInstance.get(`/third_party_api/ticket/getAllNewTickets`)
        .then((response) => setTickets(response.data))
        .catch((error) => console.error("Error fetching tickets:", error));
    } else if (activeTab === "todaytickets") {
      axiosInstance.get(`/third_party_api/ticket/getAllNewTickets`)
        .then((response) => {
          const today = new Date().toISOString().split("T")[0];
          const filtered = response.data.filter((ticket) => {
            const ticketDate = new Date(ticket.queryTime).toISOString().split("T")[0];
            return ticketDate === today;
          });
          setTodayTickets(filtered);
        })
        .catch((error) => console.error("Error fetching today's tickets:", error));
    } else if (activeTab === "totalsales") {
      axiosInstance.get(`/invoice/getVerifiedInvoives`)
        .then((response) => setInvoices(response.data))
        .catch((error) => console.error("Error fetching invoices:", error));
    } else if (activeTab === "todaysales") {
      axiosInstance.get(`/invoice/getVerifiedInvoives`)
        .then((response) => {
          const today = new Date().toISOString().split("T")[0];
          const filtered = response.data.filter((invoice) => {
            const saleDate = new Date(invoice.saleDate).toISOString().split("T")[0];
            return saleDate === today;
          });
          setTodayInvoices(filtered);
        })
        .catch((error) => console.error("Error fetching today's invoices:", error));
    } else if (activeTab === "existingcustomer") {
      axiosInstance.get(`/customers/getAll`)
        .then((response) => {
          const filteredExistingCustomers = response.data.filter(
            (customer) => customer.customerType?.toLowerCase() === "existing"
          );
          setCustomers(filteredExistingCustomers);
        })
        .catch((error) => console.error("Error fetching existing customers:", error));
    } else if (activeTab === "newcustomer") {
      axiosInstance.get(`/customers/getAll`)
        .then((response) => {
          const filteredNewCustomers = response.data.filter(
            (customer) => customer.customerType?.toLowerCase() === "new"
          );
          setNewCustomers(filteredNewCustomers);
        })
        .catch((error) => console.error("Error fetching new customers:", error));
    }
  }, [activeTab]);

  const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

  const handleVerifyInvoice = async (invoiceId) => {
    try {
        const response = await axiosInstance.get(`/invoice/verifyInvoiceByAdmin/${invoiceId}`);
        toast.success(response.data.message || 'Invoice verified successfully!', { autoClose: 3000 });
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to verify invoice', { autoClose: 3000 });
    }
};

  // Search logic
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filtered data for tickets
  const filteredTickets = tickets.filter((ticket) =>
    ticket.senderName?.toLowerCase().includes(search.toLowerCase()) ||
    ticket.senderEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered data for today's tickets
  const filteredTodayTickets = todayTickets.filter((ticket) =>
    ticket.senderName?.toLowerCase().includes(search.toLowerCase()) ||
    ticket.senderEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered data for existing customers
  const filteredCustomers = customers.filter((customer) =>
    customer.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    customer.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered data for new customers
  const filteredNewCustomers = newCustomers.filter((customer) =>
    customer.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    customer.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered data for sales/invoices
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered data for today's sales/invoices
  const filteredTodayInvoices = todayInvoices.filter(
    (invoice) =>
      invoice.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="followup-table-section">
      <div className="container-fluid">
        <div className="container">
          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="totalticket" title="Total Ticket" />
            <Tab eventKey="todaytickets" title="Today Tickets" />
            <Tab eventKey="totalsales" title="Total Sales" />
            <Tab eventKey="todaysales" title="Today Sales" />
            <Tab eventKey="preparingforshipment" title="Preparing for Shipment" />
            <Tab eventKey="awaitingtracking" title="Awaiting Tracking" />
            <Tab eventKey="existingcustomer" title="Existing Customer" />
            <Tab eventKey="newcustomer" title="New Customer" />
          </Tabs>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <InputGroup className="search-input">
              <FormControl
                placeholder={`Search ${activeTab === "existingcustomer" || activeTab === "newcustomer" ? "customers" : "tickets"
                  } by name or email`}
                value={search}
                onChange={handleSearch}
              />
            </InputGroup>
          </div>

          {/* Table Rendering for Total Tickets */}
          {activeTab === "totalticket" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Product Name</th>
                  <th>Query Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <tr key={ticket.uniqueQueryId || index}>
                    <td><input type="checkbox" /></td>
                    <td>{ticket.queryTime}</td>
                    <td>{ticket.senderName}</td>
                    <td>{ticket.senderEmail}</td>
                    <td>{ticket.senderMobile}</td>
                    <td>{ticket.queryProductName}</td>
                    <td>{ticket.queryType}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Table Rendering for Today's Tickets */}
          {activeTab === "todaytickets" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Product Name</th>
                  <th>Query Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTodayTickets.map((ticket, index) => (
                  <tr key={ticket.uniqueQueryId || index}>
                    <td><input type="checkbox" /></td>
                    <td>{ticket.queryTime}</td>
                    <td>{ticket.senderName}</td>
                    <td>{ticket.senderEmail}</td>
                    <td>{ticket.senderMobile}</td>
                    <td>{ticket.queryProductName}</td>
                    <td>{ticket.queryType}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Table Rendering for Existing Customers */}
          {activeTab === "existingcustomer" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Customer Type</th>
                  <th>Ticket ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td><input type="checkbox" /></td>
                    <td>{customer.customerId}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.customerEmail}</td>
                    <td>{customer.customerMobile}</td>
                    <td>{customer.country}</td>
                    <td>{customer.customerType}</td>
                    <td>{customer.ticketId}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Table Rendering for New Customers */}
          {activeTab === "newcustomer" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Customer Type</th>
                  <th>Ticket ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredNewCustomers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td><input type="checkbox" /></td>
                    <td>{customer.customerId}</td>
                    <td>{customer.customerName}</td>
                    <td>{customer.customerEmail}</td>
                    <td>{customer.customerMobile}</td>
                    <td>{customer.country}</td>
                    <td>{customer.customerType}</td>
                    <td>{customer.ticketId}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Table Rendering for Total Sales */}
          {activeTab === "totalsales" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  {/* <th scope="col">Ser n.</th> */}
                  <th scope="col">Order ID</th>
                  <th scope="col">Sale Date</th>
                  <th scope="col">Closer Name</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Customer Email</th>
                  <th scope="col">Street</th>
                  <th scope="col">City</th>
                  <th scope="col">State</th>
                  <th scope="col">Zip Code</th>
                  <th scope="col">Country</th>
                  <th scope="col" className='text-center'>Product Details  </th>
                  <th scope="col">Doses</th>
                  <th scope="col">Tracking Number</th>
                  <th scope="col">Paymnent Windows</th>
                  <th scope="col">Shipping Through</th>
                  <th scope="col">Paid Amount</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice.invoiceId}>
                    {/* <td className="text-center">{index + 1}.</td> */}
                    <td className='text-center'>{invoice.invoiceId || "N/A"}</td>
                    <td>{formatDate(invoice.saleDate)}</td>
                    <td> {invoice.closerName} </td>
                    <td>{invoice.customerName}
                      <button
                        type="button"
                        onClick={() => handleShowCustomerModal(invoice)} // Show customer details modal
                        className="btn btn-link p-0">....
                      </button>
                    </td>
                    <td> {invoice.customerEmail} </td>
                    <td className='text-center'>{invoice.address?.landmark || "N/A"}</td>
                    <td className='text-center'>{invoice.address?.city || "N/A"}</td>
                    <td className='text-center'>{invoice.address?.state || "N/A"}</td>
                    <td className='text-center'>{invoice.address?.zipCode || "N/A"}</td>
                    <td className='text-center'>
                      <img src={getFlagUrl(invoice.countryIso)} alt="" /> {invoice.countryIso}
                    </td>
                    <td className='text-center'>
                      <table className="table-bordered">
                        <thead>
                          <tr>
                            <th className="px-4">Name</th>
                            <th className="px-3">Quantity</th>
                            <th className="px-3">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.orderDto.productOrders.map((order, i) =>
                            order.product?.map((product, index) => (
                              <tr key={`${i}-${index}`} className="table table-bordered">
                                <td scope="col">{product.name}</td>
                                <td scope="col">{order.quantity || 'N/A'}</td>
                                <td scope="col">{invoice.currency}{order.totalAmount || 'N/A'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </td>
                    <td className='text-center'>
                      {invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}
                    </td>
                    <td className='text-center'>{invoice.trackingNumber || "N/A"}</td>
                    <td>{invoice.payment?.paymentWindow || 'N/A'}</td>
                    <td><button>Add</button></td>
                    <td className="text-success bold-text">
                      {invoice.currency || 'USD'} {invoice.payment?.amount}
                    </td>
                    <td>
                      {invoice.isVerifiedByAdmin ? (
                        <i className="fa-solid fa-check fa-2xl" style={{ color: "#31c913" }}></i>
                      ) : (
                        <Button
                          variant="success rounded"
                          onClick={() => handleVerifyInvoice(invoice.invoiceId)}
                        >
                          Next
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Table Rendering for Today's Sales */}
          {activeTab === "todaysales" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  {/* <th scope="col">Ser n.</th> */}
                  <th scope="col">Order ID</th>
                  <th scope="col">Sale Date</th>
                  <th scope="col">Closer Name</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Customer Email</th>
                  <th scope="col">Street</th>
                  <th scope="col">City</th>
                  <th scope="col">State</th>
                  <th scope="col">Zip Code</th>
                  <th scope="col">Country</th>
                  <th scope="col" className='text-center'>Product Details </th>
                  <th scope="col">Doses</th>
                  <th scope="col">Tracking Number</th>
                  <th scope="col">Paymnent Windows</th>
                  <th scope="col">Shipping Through</th>
                  <th scope="col">Paid Amount</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTodayInvoices.map((invoice, index) => (
                  <tr key={invoice.invoiceId}>
                    {/* <td className="text-center">{index + 1}.</td> */}
                    <td className='text-center'>{invoice.invoiceId || "N/A"}</td>
                    <td>{formatDate(invoice.saleDate)}</td>
                    <td> {invoice.closerName} </td>
                    <td>{invoice.customerName}
                      <button
                        type="button"
                        onClick={() => handleShowCustomerModal(invoice)}
                        className="btn btn-link p-0">....
                      </button>
                    </td>
                    <td> {invoice.customerEmail} </td>
                    <td className='text-center'>{invoice.address?.landmark || "N/A"}</td>
                    <td className='text-center'>{invoice.address?.city || "N/A"}</td>
                    <td className='text-center'>{invoice.address?.state || "N/A"}</td>
                    <td className='text-center'>{invoice.address?.zipCode || "N/A"}</td>
                    <td className='text-center'>
                      <img src={getFlagUrl(invoice.countryIso)} alt="" /> {invoice.countryIso}
                    </td>
                    <td className='text-center'>
                      <table className="table-bordered">
                        <thead>
                          <tr>
                            <th className="px-4">Name</th>
                            <th className="px-3">Quantity</th>
                            <th className="px-3">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.orderDto.productOrders.map((order, i) =>
                            order.product?.map((product, index) => (
                              <tr key={`${i}-${index}`} className="table table-bordered">
                                <td scope="col">{product.name}</td>
                                <td scope="col">{order.quantity || 'N/A'}</td>
                                <td scope="col">{invoice.currency}{order.totalAmount || 'N/A'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </td>
                    <td className='text-center'>
                      {invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}
                    </td>
                    <td className='text-center'>{invoice.trackingNumber || "N/A"}</td>
                    <td>{invoice.payment?.paymentWindow || 'N/A'}</td>
                    <td><button>Add</button></td>
                    <td className="text-success bold-text">
                      {invoice.currency || 'USD'} {invoice.payment?.amount}
                    </td>
                    <td>
                      {invoice.isVerifiedByAdmin ? (
                        <i className="fa-solid fa-check fa-2xl" style={{ color: "#31c913" }}></i>
                      ) : (
                        <Button
                          variant="success rounded"
                          onClick={() => handleVerifyInvoice(invoice.invoiceId)}
                        >
                          Next
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

        </div>
      </div>
    </section>
  );
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(',', ''); // Removes the comma if it appears
};


export default Index;
