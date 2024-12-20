import React, { useState, useEffect } from "react";
import { Tabs, Tab, Table, InputGroup, FormControl } from "react-bootstrap";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is configured
import { Form, Modal, Button } from 'react-bootstrap';
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
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [tracking, setTracking] = useState("");
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
  const [uniqueQueryId, setUniqueQueryId] = useState(null);

  const [preparingShipment, setPreparingShipment] = useState([]);
  const [awaitingtracking, setAwaitingtracking] = useState([]);


  // Fetch careers data when the modal is opened
  const handleShowModal = (invoiceId) => {
    setCurrentInvoiceId(invoiceId);
    axiosInstance.get(`/career/gelAll`)
      .then((response) => setCareers(response.data))
      .catch((error) => console.error("Error fetching careers:", error));
    setShowCareerModal(true);
  };
  const handleCloseModal = () => {
    setShowCareerModal(false); // Close the career modal
    setShowTrackingModal(false); // Close the tracking modal
    setSelectedCareer("");
    setTracking("");
  };

  // Submit selected career to the API
  const handleAddCareer = async () => {
    if (!selectedCareer) {
      toast.error("Please select a career option.");
      return;
    }
    try {
      const response = await axiosInstance.post(`/invoice/addCareer/${currentInvoiceId}?careerName=${selectedCareer}`, {
        careerName: selectedCareer
      });
      toast.success(response.data.message || "Career added successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add career.");
    }
  };

  const handleShowTrackingModal = (queryId) => {
    setUniqueQueryId(queryId); // Ensure the unique query ID is set here
    setShowTrackingModal(true);
  };

  // Submit tracking to the API
  const handleAddTracking = async () => {
    if (!tracking) {
      toast.error("Please enter a tracking number.");
      return;
    }
    try {
      const response = await axiosInstance.post(`/invoice/addTrackingNumber`, {
        trackingNumber: tracking,
        ticketId: uniqueQueryId,
      });
      toast.success(response.data.message || "Tracking added successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add tracking.");
    }
  };



  //formate date 
  const formatDateToString = (dateArray) => {
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Fetch data when the tab changes
  useEffect(() => {
    // Fetch all tickets
    axiosInstance.get(`/third_party_api/ticket/getAllNewTickets`)
      .then((response) => {
        setTickets(response.data);
        const today = new Date().toISOString().split("T")[0];
        const filteredToday = response.data.filter((ticket) => {
          const ticketDate = new Date(ticket.queryTime).toISOString().split("T")[0];
          return ticketDate === today;
        });
        setTodayTickets(filteredToday);
      })
      .catch((error) => console.error("Error fetching tickets:", error));

    // Fetch all invoices
    axiosInstance.get(`/invoice/getVerifiedInvoives`)
      .then((response) => {
        setInvoices(response.data);
        const today = new Date().toISOString().split("T")[0];
        const filteredToday = response.data.filter((invoice) => {
          const saleDate = formatDateToString(invoice.verificationDate);
          return saleDate === today;
        });
        setTodayInvoices(filteredToday);
        const preparingShipmentInvoices = response.data.filter((invoice) => invoice.isVerifiedByAdmin === true);
        setPreparingShipment(preparingShipmentInvoices);
        const awaitingTrackingInvoices = response.data.filter((invoice) =>
          invoice.trackingNumber === null && invoice.isVerifiedByAdmin === true
        );
        setAwaitingtracking(awaitingTrackingInvoices);
      })
      .catch((error) => console.error("Error fetching invoices:", error));

    // Fetch all customers
    axiosInstance.get(`/customers/getAll`)
      .then((response) => {
        const existing = response.data.filter(
          (customer) => customer.customerType?.toLowerCase() === "existing"
        );
        setCustomers(existing);

        const newCust = response.data.filter(
          (customer) => customer.customerType?.toLowerCase() === "new"
        );
        setNewCustomers(newCust);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);


  const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

  const handleVerifyInvoice = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`/invoice/verifyInvoiceByAdmin/${invoiceId}`);
      toast.success(response.data.message || 'Invoice verified successfully!', { autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify invoice', { autoClose: 3000 });
    }
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

  // Filtered data for preprating for shippment
  const filteredPreparingShipment = preparingShipment.filter(
    (invoice) =>
      invoice.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtered data for awating tracking
  const filteredAwaitingtracking = awaitingtracking.filter(
    (invoice) =>
      invoice.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  console.log(todayInvoices)
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
            <Tab eventKey="totalticket" title={<>Total Tickets (<span style={{ color: 'red' }}>{tickets.length}</span>)</>} />
            <Tab eventKey="todaytickets" title={<>Today's Tickets (<span style={{ color: 'red' }}>{todayTickets.length}</span>)</>} />
            <Tab eventKey="totalsales" title={<> Total Sales (<span style={{ color: 'red' }}>{invoices.length}</span>)</>} />
            <Tab eventKey="todaysales" title={<> Today's Sales (<span style={{ color: 'red' }}>{todayInvoices.length}</span>)   </>} />
            <Tab eventKey="preparingforshipment" title={<>Preparing for Shipment (<span style={{ color: 'red' }}>{preparingShipment.length}</span>)</>} />
            <Tab eventKey="awaitingtracking" title={<>Awaiting Tracking (<span style={{ color: 'red' }}>{awaitingtracking.length}</span>) </>} />
            <Tab eventKey="existingcustomer" title={<> Existing Customers (<span style={{ color: 'red' }}>{customers.length}</span>)</>} />
            <Tab eventKey="newcustomer" title={<>New Customers (<span style={{ color: 'red' }}>{newCustomers.length}</span>)  </>} />
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
                  <th>S.N.</th>
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
                    <td>{index + 1}.</td>
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
                  <th>S.N.</th>
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
                    <td>{index + 1}.</td>
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

          {/* Table Rendering for Total Sales */}
          {activeTab === "totalsales" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th>S.N.</th>
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
                  <th scope="col">Delivery Status</th>
                  <th scope="col">Paid Amount</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr key={invoice.invoiceId}>
                    <td>{index + 1}.</td>
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
                    <td>
                      {invoice.shippingCareer ? invoice.shippingCareer : <Button variant="info rounded" onClick={() => handleShowModal(invoice.invoiceId)}>
                        Add
                      </Button>}
                    </td>
                    <td>{invoice.deliveryStatus || 'N/A'}</td>
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
                  <th>S.N.</th>
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
                {todayInvoices.map((invoice, index) => (
                  <tr key={invoice.invoiceId}>
                    <td>{index + 1}.</td>
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
                    <td>
                      {invoice.shippingCareer ? invoice.shippingCareer : <Button variant="info rounded" onClick={() => handleShowModal(invoice.invoiceId)}>
                        Add
                      </Button>}
                    </td>
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

          {/* Table Rendering for preparingforshipment */}
          {activeTab === "preparingforshipment" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th>S.N.</th>
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
                {preparingShipment.map((invoice, index) => (
                  <tr key={invoice.invoiceId}>
                    <td>{index + 1}.</td>
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
                    <td>
                      {invoice.shippingCareer ? invoice.shippingCareer : <Button variant="info rounded" onClick={() => handleShowModal(invoice.invoiceId)}>
                        Add
                      </Button>}
                    </td>
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

          {/* Table Rendering for awaiting tracking */}
          {activeTab === "awaitingtracking" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th>S.N.</th>
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
                {awaitingtracking.map((invoice, index) => (
                  <tr key={invoice.invoiceId}>
                    <td className="text-center">{index + 1}.</td>
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
                    {/* <td className='text-center'>{invoice.trackingNumber || "N/A"}</td> */}
                    <td>
                      {invoice.trackingNumber ? invoice.trackingNumber : <Button variant="warning rounded" onClick={() => handleShowTrackingModal(invoice.uniqueQueryId)}>
                        Add Tracking
                      </Button>}
                    </td>
                    <td>{invoice.payment?.paymentWindow || 'N/A'}</td>
                    <td>
                      {invoice.shippingCareer ? invoice.shippingCareer : <Button variant="info rounded" onClick={() => handleShowModal(invoice.invoiceId)}>
                        Add
                      </Button>}
                    </td>
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
          {/* Table Rendering for Existing Customers */}
          {activeTab === "existingcustomer" && (
            <Table responsive bordered className="candidate-table">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Date</th>
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
                {filteredCustomers.map((customer, index) => (
                  <tr key={customer.customerId}>
                    <td>{index + 1}</td>
                    <td>{customer.queryTime}</td>
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
                  <th>S.N.</th>
                  <th>Date</th>
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
                {filteredNewCustomers.map((customer, index) => (
                  <tr key={customer.customerId}>
                    <td>{index + 1}.</td>
                    <td>{customer.queryTime}</td>
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
        </div>
      </div>

      {/* Add Career Modal  */}
      <Modal show={showCareerModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Career</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="careerSelect">
              <Form.Label>Select Career</Form.Label>
              <Form.Control as="select" value={selectedCareer} onChange={(e) => setSelectedCareer(e.target.value)}>
                <option value="">-- Select a Career --</option>
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.careerName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddCareer}>
            Add Career
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Tracking Modal */}
      <Modal show={showTrackingModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tracking Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTrackingNumber">
            <Form.Label>Tracking Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tracking number"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTracking}>
            Add Tracking
          </Button>
        </Modal.Footer>
      </Modal>



    </section>

  );
};

export default Index;
