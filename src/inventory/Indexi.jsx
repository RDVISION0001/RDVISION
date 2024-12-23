import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Form, Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
// Authentication context
import { useAuth } from '../auth/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logout from '../auth/logout';

function Indexi() {
  const { roleName, userId } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [filter, setFilter] = useState('all'); // Default to "all"
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [tracking, setTracking] = useState("");
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

  // Fetch careers data when the modal is opened
  const handleShowModal = (invoice) => {
    console.log("Current Invoice ID:", invoice.invoiceId);
    setCurrentInvoiceId(invoice.invoiceId);
    setTracking(""); // Reset the tracking input
    setShowTrackingModal(true);
  };

  const handleCloseModal = () => {
    // Reset modal-specific states
    setTracking("");                // Reset tracking number
    setCurrentInvoiceId(null);      // Reset the current invoice ID
    setShowTrackingModal(false);    // Close the tracking modal
    setShowCustomerModal(false);   // Close the customer details modal if open
  };

  // Submit tracking to the API
  const handleAddTracking = async () => {
    if (!tracking) {
      toast.error("Please enter a tracking number.");
      return;
    }

    if (!currentInvoiceId) {
      toast.error("No invoice selected for tracking.");
      return;
    }

    try {
      const invoice = invoices.find((inv) => inv.invoiceId === currentInvoiceId);
      const uniqueQueryId = invoice?.orderDto?.ticketId;

      if (!uniqueQueryId) {
        toast.error("No ticket ID associated with this invoice.");
        return;
      }

      const response = await axiosInstance.post(`/invoice/addTrackingNumber`, {
        trackingNumber: tracking,
        ticketId: uniqueQueryId,
      });

      toast.success(response.data.message || "Tracking added successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error adding tracking:", error);
      toast.error(error.response?.data?.message || "Failed to add tracking.");
    }
  };


  const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get('/invoice/getVerifiedInvoives');
        setInvoices(response.data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // API call to verify invoice
  const handleVerifyInvoice = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`/invoice/verifyInvoiceByAdmin/${invoiceId}`);
      toast.success(response.data.message || 'Invoice verified successfully!', { autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify invoice', { autoClose: 3000 });
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

    switch (filter) {
      case 'today':
        return invoices.filter(invoice => {
          const verificationDate = new Date(invoice.verificationDate);
          return verificationDate >= todayStart && verificationDate < tomorrowStart;
        });
      case 'yesterday':
        return invoices.filter(invoice => {
          const verificationDate = new Date(invoice.verificationDate);
          return verificationDate >= yesterdayStart && verificationDate < todayStart;
        });
      case 'parsho': // Day before yesterday
        return invoices.filter(invoice => {
          const verificationDate = new Date(invoice.verificationDate);
          return verificationDate >= dayBeforeYesterdayStart && verificationDate < yesterdayStart;
        });
      case 'all':
      default:
        return invoices;
    }
  };

  const filteredInvoices = getFilteredInvoices();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <h3 className="title mb-4">Verified Sales</h3>
            <div className="d-flex justify-content-between">
              {/* Filter Buttons */}
              <div className="mb-3 d-flex justify-content-start gap-3">
                {/* <Button
                variant={filter === 'today' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('today')}
                className="btn-lg"
              >
                Today
              </Button>
              <Button
                variant={filter === 'yesterday' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('yesterday')}
                className="btn-lg"
              >
                Yesterday
              </Button>
              <Button
                variant={filter === 'parsho' ? 'primary' : 'outline-primary'}
                onClick={() => setFilter('parsho')}
                className="btn-lg"
              >
                Day Before Yesterday
              </Button> */}
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('all')}
                  className="btn btn-primary"
                >
                  All
                </Button>
                <Button
                  className="btn btn-primary"
                >
                  Product List
                </Button>
              </div>
              {localStorage.getItem("userId") && (
                <p className="nav-item">
                  <Link className="nav-link">
                    <i className="fa-solid fa-power-off text-danger" style={{ fontSize: '2rem' }}></i>
                    <span className="nav-text cursor-pointer"><Logout /></span>
                  </Link>
                </p>
              )}
            </div>

            {/* Invoice Table */}
            <div className="followups-table table-responsive table-height">
              <table className="table table-bordered table-hover table-sm excel-table" style={{ border: '2px solid #000' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Order ID</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Sale Date</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Tracking Number</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Tracking Status</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Shipping Label</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Customer Name</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Street</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>City</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>State</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Zip Code</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Country</th>
                    <th className="border-dark text-center" style={{ backgroundColor: '#FFC300' }}>Product Details</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Doses</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Rate/Qty </th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Total Goods Cost</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Shipping Charges</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Total cost</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Paid Amount</th>
                    <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>Due Amount</th>
                    {/* {roleName === 'admin' && <th className="border-dark">Action</th>} */}
                  </tr>
                </thead>

                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoiceId}>
                      <td className="border-dark">{invoice.invoiceId || "N/A"}</td>
                      <td className="border-dark">{formatDate(invoice.saleDate)}</td>
                      <td>
                        {invoice.trackingNumber ? (
                          invoice.trackingNumber
                        ) : (
                          <Button variant="warning rounded" onClick={() => handleShowModal(invoice)}>
                            Add Tracking
                          </Button>
                        )}
                      </td>
                      <td className={`border-dark ${!invoice.deliveryStatus ? 'text-danger' : ''}`}>
                        {invoice.deliveryStatus || 'Inactive'}
                      </td>
                      <td className="border-dark"><i class="fa-solid fa-truck-fast fa-2xl"></i></td>
                      <td className="border-dark">
                        {invoice.customerName}
                      </td>
                      <td className="border-dark">{invoice.address?.landmark || "N/A"}</td>
                      <td className="border-dark">{invoice.address?.city || "N/A"}</td>
                      <td className="border-dark">{invoice.address?.state || "N/A"}</td>
                      <td className="border-dark">{invoice.address?.zipCode || "N/A"}</td>
                      <td className="border-dark">
                        <img src={getFlagUrl(invoice.countryIso)} alt="" /> {invoice.countryIso}
                      </td>
                      <td className="text-center">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th style={{ width: "200px" }} className="px-4">Name</th>
                              <th style={{ width: "100px" }} className="px-3">Quantity</th>
                              <th style={{ width: "150px" }} className="px-3">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.orderDto.productOrders.map((order, i) => (
                              order.product?.map((product, index) => (
                                <tr key={`${i}-${index}`}>
                                  <td>{product.name || 'N/A'}</td>
                                  <td>{order.quantity || 'N/A'}</td>
                                  <td>{invoice.currency}{order.totalAmount || 'N/A'}</td>
                                </tr>
                              ))
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td className="border-dark">{invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}</td>
                      <td className="border-dark"></td>
                      <td className="border-dark"></td>
                      <td className="border-dark"></td>
                      <td className="border-dark"></td>
                      <td className="border-dark"></td>
                      <td className="border-dark"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
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
      <ToastContainer />
    </>
  );
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(',', '');
};

export default Indexi;

