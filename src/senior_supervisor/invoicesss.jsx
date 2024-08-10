import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';

//// Components ////
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//// Auth ////
import { useAuth } from '../auth/AuthContext';

function invoicesss() {
  const { userId } = useAuth();

  // State for modal visibility
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // State for tickets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);


  // Fetch tickets from ticketByStatus
  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId) return; 
      try {
        const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
          params: {
            userId,
            ticketStatus: 'Sale'
          }
        });
        setTickets(response.data.dtoList);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  // Fetch ticket details when selectedTicketId changes
  useEffect(() => {
    if (selectedTicketId) {
      const fetchTicketDetails = async () => {
        try {
          const response = await axiosInstance.get(`/third_party_api/ticket/getTicket/${selectedTicketId}`);
          setTicketDetails(response.data.dtoList);
        } catch (err) {
          console.error('Error fetching ticket details:', err);
        }
      };
      fetchTicketDetails();
    }
  }, [selectedTicketId]);

  const handleCardClick = (ticketId) => {
    setSelectedTicketId(ticketId.uniqueQueryId);
  };

  // Form state for adding products
  const [formData, setFormData] = useState({
    // brand: '',
    // treatment: '',
    quantity: '',
    selectedProductId: '',
    ticketId: '',
    userId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/order/addToOrder', {
        // brand: formData.brand,
        // treatment: formData.treatment,
        quantity: formData.quantity,
        productId: formData.selectedProductId,
        ticketId: selectedTicketId,
        userId: userId,
      });
      console.log('Response:', response.data);
      toast.success('Add order successfully!');
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add order');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // State for products
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/product/getAllProducts');
        setProducts(response.data.dtoList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, [selectedTicketId]);

  const [orderDetails, setOrderDetails] = useState(null);

  // Fetch order details from apiB when selectedTicketId changes
  useEffect(() => {
    if (selectedTicketId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axiosInstance.get(`/order/getOrder/${selectedTicketId}`);
          setOrderDetails(response.data.dtoList);
        } catch (err) {
          console.error('Error fetching order details:', err);
        }
      };

      fetchOrderDetails();
    }
  }, [selectedTicketId]);

  // Create shipping address
  useEffect(() => {
    if (selectedTicketId) {
      const fetchAddressDetails = async () => {
        try {
          const response = await axiosInstance.get(`/address/getAddress/${selectedTicketId}`);
          setaAddressDat(response.data.dto);
        } catch (err) {
          console.error('Error fetching address details:', err);
        }
      };

      fetchAddressDetails();
    }
  }, [selectedTicketId]);

  const [addressData, setaAddressDat] = useState({
    houseNumber: '',
    landmark: '',
    city: '',
    zipCode: '',
    state: '',
    country: '',
  });

  const [response, setResponse] = useState(null);

  const handleshipChange = (e) => {
    setaAddressDat({
      ...addressData,
      [e.target.name]: e.target.value
    });
  };

  const handleshipSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/address/createAddress', {
        houseNumber: String(addressData.houseNumber),
        landmark: String(addressData.landmark),
        city: String(addressData.city),
        zipCode: String(addressData.zipCode),
        state: String(addressData.state),
        country: String(addressData.country),
        ticketId: String(selectedTicketId)
      });
      setResponse(response.data);
      toast.success('Address added successfully!');
    } catch (err) {
      setError(err);
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle sending invoice
  const handleSendInvoice = async () => {
    try {
      const response = await axiosInstance.post(`/invoice/send-invoice?ticketId=${selectedTicketId}`);
      console.log('Response:', response.data);
      toast.success('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
    }
  };


  return (
    <>
      <div className="superadmin-page">
        {/* <!-- Side-Nav --> */}
        <Sidenav />
        {/* <!-- Main Wrapper --> */}
        <div className="my-container main-content-block2658 active-cont">
          {/* <!-- Top Nav --> */}
          <Topnav />
          {/* <!--End Top Nav --> */}
          <div className="container-fluid mt-3">
            {/* <!-- Section one --> */}
            <section className="sadmin-top-section">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                      </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                      </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                      </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                      </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* <!-- graphs and ranking --> */}
            <section className="orders-view-wrapper common-tab-view-section py-5">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-5">
                    <div className="order-menu-wrapper">
                      <div className="nav flex-column vertical-tab-nav" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        {/* <!-- ticket one ends here  --> */}
                        {tickets.map(ticket => (
                          <div className="nav-link" id="v-pills-ticket2-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ticket2" type="button" role="tab" aria-controls="v-pills-ticket2" aria-selected="true">
                            <div className="order-card" key={ticket.uniqueQueryId} onClick={() => handleCardClick(ticket)}>
                              <div className="left-part">
                                <h3 className="title">{ticket.queryMcatName}</h3>
                                <p className="sub-title text-warning-emphasis">
                                  <i className="fa-solid fa-ticket"></i>
                                  {ticket.uniqueQueryId}
                                </p>
                              </div>
                              <div className="right-part">AT : <span className="badge no-status">{ticket.ticketstatus}</span></div>
                            </div>
                          </div>
                        ))}
                        {/* <!-- ticket two ends here  --> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-7">
                    <div className="tab-content vertical-tab-body-wrapper" id="v-pills-tabContent">
                      {/* <!-- tab one  --> */}
                      <div className="tab-pane fade show active" id="v-pills-ticket1" role="tabpanel" aria-labelledby="v-pills-ticket1-tab" tabindex="0">
                        <div className="order-cards-details-wrapper-main">
                          {ticketDetails ? (
                            <div className="order-details-card">
                              <div className="header">
                                <p className="title">{ticketDetails.uniqueQueryId}</p>
                                <p className="date">{ticketDetails.queryTime}</p>
                              </div>
                              <div className="card">
                                <div className="thumb-wrapper">
                                  <img src="../img/thumb-img.png" alt="thumb-image" className="img-fluid" />
                                </div>
                                <div className="content-wrapper">
                                  <h3 className="title">{ticketDetails.queryProductName}</h3>
                                  <div className="contact-wrapper">
                                    <div className="contact-item"><i className="fa-solid fa-phone"></i> {ticketDetails.senderMobile}</div>
                                    <div className="contact-item">
                                      <i className="fa-solid fa-envelope-open-text"></i>
                                      {ticketDetails.senderEmail}
                                    </div>
                                  </div>
                                  <div className="address-items mt-2">
                                    <small>Billing Address</small>
                                    <address>{ticketDetails.senderAddress}</address>
                                  </div>
                                  <div className="address-items">
                                    <small>Delivery Address</small>
                                    <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p>Loading...</p>
                          )}
                          {/* <!-- ticket details ends here --> */}
                          <div className="accordion status-wrappers" id="accordionExample">
                            {orderDetails ? (
                              <div className="accordion-item">
                                <h2 className="accordion-header">
                                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                  <div className="accordion-body">
                                    <div className="order-lists">
                                      <div className="items-wrapper">
                                        <div className="list-item header">
                                          <p className="title"></p>
                                          <p className="cost"></p>
                                        </div>
                                        <div className="list-item otr-list">
                                          <p className="item">TicketId: <span>{orderDetails.ticketId}</span></p>
                                          <p className="item">Quantity : <span>{orderDetails.quantity}</span></p>
                                          <p className="item">UserId: <span>{orderDetails.userId}</span></p>
                                        </div>
                                      </div>
                                      <table className="table">
                                        <thead>
                                          <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Brand</th>
                                            <th scope="col">Composition</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Pills Qty</th>
                                            <th scope="col">Price</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {orderDetails.productOrders && orderDetails.productOrders.map((productOrder, index) => (
                                            productOrder.product && productOrder.product[0] ? (
                                              <tr key={index}>
                                                <td>{productOrder.product[0].name}</td>
                                                <td>{productOrder.product[0].brand}</td>
                                                <td>{productOrder.product[0].composition}</td>
                                                <td>{productOrder.product[0].packagingSize}</td>
                                                <td>{productOrder.product[0].pillsQty}</td>
                                                <td>{productOrder.product[0].price}</td>
                                              </tr>
                                            ) : (
                                              <tr key={index}>
                                                <td colSpan="6">Product details not available</td>
                                              </tr>
                                            )
                                          ))}
                                        </tbody>
                                      </table>
                                      <div className="total">
                                        <p>Total</p>
                                        <p>{orderDetails.totalPayableAmount}</p>
                                      </div>
                                      <div className="add-more-products-wrapper">
                                        <Button onClick={handleShow} data-bs-toggle="modal" data-bs-target="#addMoreItemsModal" className="btn btn-primary">Add Product</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p>Loading...</p>
                            )}

                            {/* /////////////////shipping address */}

                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-toggle="collapse" href="shippingDetils" data-bs-target="shippingDetils" aria-expanded="true" aria-controls="collapseOne">Sales/Invoice Details asadsds</button>
                              </h2>

                              <div id="shippingDetils" className="accordion-collapse collapse show" data-bs-parent="#accordionAddressDetails">
                                {selectedTicketId && (
                                  <div className="accordion-body">
                                    <form onSubmit={handleshipSubmit}>
                                      <div className="row g-3">
                                        <div className="col-12">
                                          <label for="name" className="form-label">Shiping To :</label>
                                          <input type="text" id="name" className="form-control" placeholder="Eg. Jane Kapoor" />
                                        </div>
                                        <div className="col-12">
                                          <h3 className="fieldset-heading">Shipping Address</h3>
                                        </div>
                                        <div className="col-6">
                                          <label for="hNo" className="form-label">House No./ Street</label>
                                          <input
                                            name="houseNumber"
                                            value={addressData.houseNumber}
                                            onChange={handleshipChange}
                                            id="hNo"
                                            className="form-control"
                                          />
                                        </div>
                                        <div className="col-6">
                                          <label for="hNo" className="form-label">Landmark</label>
                                          <input
                                            type="text"
                                            name="landmark"
                                            value={addressData.landmark}
                                            onChange={handleshipChange}
                                            id="hNo"
                                            className="form-control"
                                          />
                                        </div>
                                        <div className="col-6">
                                          <label for="city" className="form-label">City</label>
                                          <input
                                            type="text"
                                            name="city"
                                            value={addressData.city}
                                            onChange={handleshipChange}
                                            id="city"
                                            className="form-control"
                                          />
                                        </div>
                                        <div className="col-6">
                                          <label for="zipCode" className="form-label">Zip Code</label>
                                          <input
                                            type="text"
                                            name="zipCode"
                                            value={addressData.zipCode}
                                            onChange={handleshipChange}
                                            id="zipCode"
                                            className="form-control"
                                          />
                                        </div>
                                        <div className="col-6">
                                          <label for="state" className="form-label">State</label>
                                          <input
                                            type="text"
                                            name="state"
                                            value={addressData.state}
                                            onChange={handleshipChange}
                                            id="state"
                                            className="form-control"
                                          />
                                        </div>
                                        <div className="col-6">
                                          <label for="country" className="form-label">Country</label>
                                          <input
                                            type="text"
                                            name="country"
                                            value={addressData.country}
                                            onChange={handleshipChange}
                                            id="country"
                                            className="form-control"
                                          />
                                        </div>
                                        <div className="col-12">
                                          <input type="checkbox" id="checkSame" className="form-check-inline" />
                                          <label for="checkSame" className="form-label checkSame-Address">Billing address is same as shipping</label>
                                        </div>
                                        <div className="col-12">
                                          <button className="btn btn-primary w-100">Submit Address</button>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* <!-- order items details ends here --> */}
                            <div className="accordion-item payment">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="paymentDetails" aria-expanded="false" aria-controls="paymentDetails">
                                  <span>Payment Details</span>
                                  <span className="status-icon pending">
                                    {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                    <i className="fa-solid fa-hourglass-end"></i>
                                    <i className="fa-solid fa-check"></i>
                                  </span>
                                </button>
                              </h2>
                              <div id="paymentDetails" className="accordion-collapse collapse show" data-bs-parent="#accordionAddressDetails">
                                <div className="accordion-body">
                                  <p className="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                  <div className="btns-group d-flex gap-3 justify-content-center mt-4">
                                    <a href="#" className="btn btn-primary">Check Status</a>
                                    <a variant="primary" onClick={handleSendInvoice} className="btn btn-warning">Send Invoice</a>
                                    <a href="#" className="btn btn-success">Mark As Paid</a>
                                    <a href="#" className="btn btn-danger">Mark As Hold</a>
                                  </div>
                                  {/* <!-- ------------- reason for hold --------- --> */}

                                  <div className="form-hold p-3">
                                    <form action="">
                                      <div className="form-group mb-3">
                                        <label className="form-label" for="holdReason">Define Reason</label>
                                        <textarea name="holdReason" id="holdReason" cols="20" rows="5" className="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                      </div>
                                      <a href="#" className="btn btn-danger">Hold Now</a>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <!-- tab two  --> */}
                      <div className="tab-pane fade show" id="v-pills-ticket2" role="tabpanel" aria-labelledby="v-pills-ticket2-tab" tabindex="0">
                        <div className="order-cards-details-wrapper-main">
                          <div className="order-details-card">
                            <div className="header">
                              <p className="title">TKTID:MEDEQ089N</p>
                              <p className="date">03 Mar 2023</p>
                            </div>
                            <div className="card">
                              <div className="thumb-wrapper">
                                <img src="../img/thumb-img.png" alt="thumb-image" className="img-fluid" />
                              </div>
                              <div className="content-wrapper">
                                <h3 className="title">Lorem ipsum dolor, sit amet !</h3>
                                <div className="contact-wrapper">
                                  <div className="contact-item"><i className="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                  <div className="contact-item">
                                    <i className="fa-solid fa-envelope-open-text"></i>
                                    example@email.com
                                  </div>
                                </div>
                                <div className="address-items mt-2">
                                  <small>Billing Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                                <div className="address-items">
                                  <small>Delivery Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!-- ticket details ends here --> */}
                          <div className="accordion status-wrappers" id="accordionExample">
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                              </h2>
                              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <div className="order-lists">
                                    <div className="items-wrapper">
                                      <div className="list-item header">
                                        <p className="title">Product Name</p>
                                        <p className="cost">$38.67</p>
                                      </div>
                                      <div className="list-item otr-list">
                                        <p className="item">Qty : <span>1</span></p>
                                        <p className="item">Size : <span>XL</span></p>
                                        <p className="item">Color : <span>Blue</span></p>
                                      </div>
                                    </div>
                                    <div className="total">
                                      <p>Total</p>
                                      <p>$123.5</p>
                                    </div>
                                    <div className="add-more-products-wrapper">
                                      <a data-bs-toggle="modal" data-bs-target="#addMoreItemsModal" className="btn btn-primary">Add Product</a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- order items details ends here --> */}
                            <div className="accordion-item payment">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  <span>Sales/Invoice Details asadsds</span>
                                  <span className="status-icon pending">
                                    {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                    <i className="fa-solid fa-hourglass-end"></i>
                                    <i className="fa-solid fa-check"></i>
                                  </span>
                                </button>
                              </h2>
                              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <div className="billing-form">
                                    <div className="accordion" id="accordionAddressDetails">
                                      <div className="accordion-item shipping-details-item">
                                        <h2 className="accordion-header">
                                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#shippingDetils" aria-expanded="true" aria-controls="shippingDetils">Shipping Details</button>
                                        </h2>
                                        <div id="shippingDetils" className="accordion-collapse collapse show" data-bs-parent="#accordionAddressDetails">
                                          <div className="accordion-body">
                                            <form action="#">
                                              <div className="row g-3">
                                                <div className="col-12">
                                                  <label for="name" className="form-label">Shiping To :</label>
                                                  <input type="text" id="name" className="form-control" placeholder="Eg. Jane Kapoor" />
                                                </div>
                                                <div className="col-12">
                                                  <h3 className="fieldset-heading">Shipping Address</h3>
                                                </div>
                                                <div className="col-6">
                                                  <label for="hNo" className="form-label">House No./ Street</label>
                                                  <input type="text" id="hNo" className="form-control" placeholder="Ex. 73923" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="hNo" className="form-label">Landmark</label>
                                                  <input type="text" id="hNo" className="form-control" placeholder="Eg. Near EV Charging Point" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="city" className="form-label">City</label>
                                                  <input type="text" id="city" className="form-control" placeholder="Eg. Varanasi" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="zipCode" className="form-label">Zip Code</label>
                                                  <input type="text" id="zipCode" className="form-control" placeholder="Eg. 000000" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="state" className="form-label">State</label>
                                                  <input type="text" id="state" className="form-control" placeholder="Eg. Delhi" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="country" className="form-label">Country</label>
                                                  <input type="text" id="country" className="form-control" placeholder="Eg. India" />
                                                </div>
                                                <div className="col-12">
                                                  <input type="checkbox" id="checkSame" className="form-check-inline" />
                                                  <label for="checkSame" className="form-label checkSame-Address">Billing address is same as shipping</label>
                                                </div>
                                                <div className="col-12">
                                                  <button className="btn btn-primary w-100">Submit Address</button>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="accordion-item billing-details-item mt-3">
                                        <h2 className="accordion-header">
                                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#billingDetils" aria-expanded="false" aria-controls="billingDetils">Billing Details</button>
                                        </h2>
                                        <div id="billingDetils" className="accordion-collapse collapse" data-bs-parent="#accordionAddressDetails">
                                          <div className="accordion-body">
                                            <form action="#">
                                              <div className="row g-3">
                                                <div className="col-12">
                                                  <label for="name" className="form-label">Shiping To :</label>
                                                  <input type="text" id="name" className="form-control" placeholder="Eg. Jane Kapoor" />
                                                </div>
                                                <div className="col-12">
                                                  <h3 className="fieldset-heading">Shipping Address</h3>
                                                </div>
                                                <div className="col-6">
                                                  <label for="hNo" className="form-label">House No./ Street</label>
                                                  <input type="text" id="hNo" className="form-control" placeholder="Ex. 73923" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="hNo" className="form-label">Landmark</label>
                                                  <input type="text" id="hNo" className="form-control" placeholder="Eg. Near EV Charging Point" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="city" className="form-label">City</label>
                                                  <input type="text" id="city" className="form-control" placeholder="Eg. Varanasi" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="zipCode" className="form-label">Zip Code</label>
                                                  <input type="text" id="zipCode" className="form-control" placeholder="Eg. 000000" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="state" className="form-label">State</label>
                                                  <input type="text" id="state" className="form-control" placeholder="Eg. Delhi" />
                                                </div>
                                                <div className="col-6">
                                                  <label for="country" className="form-label">Country</label>
                                                  <input type="text" id="country" className="form-control" placeholder="Eg. India" />
                                                </div>
                                                <div className="col-12">
                                                  <button className="btn btn-primary w-100">Submit Address</button>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- payment details ends here  --> */}
                            <div className="accordion-item order-status-wrapper">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                  <span>Order Status</span>
                                  <span className="status-name"> Preparing </span>
                                </button>
                              </h2>
                              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <div className="status-list-view-wrapper">
                                    <ul className="status-list">
                                      <li className="status-item success">
                                        <h3 className="title">Order Dispatched</h3>
                                        <small>10:35AM From Lucknow, India</small>
                                      </li>
                                      <li className="status-item pending">
                                        <h3 className="title">At Custom Clearance</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                      <li className="status-item blocked">
                                        <h3 className="title">On the Way Via Sea Way</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="row">
                                    <div className="form-group px-3 offset-1 col-7">
                                      <select name="orderStatus" id="order-status-select" className="form-select">
                                        <option value="0">Change Order Status</option>
                                        <option value="0">Preparing</option>
                                        <option value="0">Out From Origin</option>
                                        <option value="0">At Origin Custom Office</option>
                                        <option value="0">On the Sea Way</option>
                                        <option value="0" className="text-danger">Order Lossed</option>
                                        <option value="0">At Desitination Custom</option>
                                      </select>
                                      {/* <!-- it only apperace when the order is at delivered status --> */}
                                      <div className="col-12 d-flex gap-3 mt-2">
                                        <input type="checkbox" name="reference-ticket" id="reference-ticket-gen" />
                                        <label for="reference-ticket-gen" className="form-label">Generate Reference Token For Future Order</label>
                                      </div>
                                    </div>
                                    <div className="col-4">
                                      <button className="btn btn-primary">Update Status</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <!-- another ticket starts here  --> */}
                      <div className="tab-pane fade show" id="v-pills-ticket3" role="tabpanel" aria-labelledby="v-pills-ticket3-tab" tabindex="0">
                        <div className="order-cards-details-wrapper-main">
                          <div className="order-details-card">
                            <div className="header">
                              <p className="title">TKTID:MEDEQ089N</p>
                              <p className="date">03 Mar 2023</p>
                            </div>
                            <div className="card">
                              <div className="thumb-wrapper">
                                <img src="../img/thumb-img.png" alt="thumb-image" className="img-fluid" />
                              </div>
                              <div className="content-wrapper">
                                <h3 className="title">Lorem ipsum dolor, sit amet !</h3>
                                <div className="contact-wrapper">
                                  <div className="contact-item"><i className="fa-solid fa-phone"></i> +91 0000 000 000</div>
                                  <div className="contact-item">
                                    <i className="fa-solid fa-envelope-open-text"></i>
                                    example@email.com
                                  </div>
                                </div>
                                <div className="address-items mt-2">
                                  <small>Billing Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                                <div className="address-items">
                                  <small>Delivery Address</small>
                                  <address>098, Viraj khand, Gomti Nagar, Lucknow UP India 206202</address>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <!-- ticket details ends here --> */}
                          <div className="accordion status-wrappers" id="accordionExample">
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                              </h2>
                              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <div className="order-lists">
                                    <div className="items-wrapper">
                                      <div className="list-item header">
                                        <p className="title">Product Name</p>
                                        <p className="cost">$38.67</p>
                                      </div>
                                      <div className="list-item otr-list">
                                        <p className="item">Qty : <span>1</span></p>
                                        <p className="item">Size : <span>XL</span></p>
                                        <p className="item">Color : <span>Blue</span></p>
                                      </div>
                                    </div>
                                    <div className="total">
                                      <p>Total</p>
                                      <p>$123.5</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- order items details ends here --> */}
                            <div className="accordion-item payment">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  <span>Payment Details</span>
                                  <span className="status-icon pending">
                                    {/* <!-- change status from pending to success when payment done and make the second i enable and first one to disable--> */}
                                    <i className="fa-solid fa-hourglass-end"></i>
                                    <i className="fa-solid fa-check"></i>
                                  </span>
                                </button>
                              </h2>
                              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <p className="text text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                  <div className="btns-group d-flex gap-3 justify-content-center mt-4">
                                    <a href="#" className="btn btn-primary">Check Status</a>
                                    <a href="#" className="btn btn-warning">Send Invoice</a>
                                    <a href="#" className="btn btn-success">Mark As Paid</a>
                                    <a href="#" className="btn btn-danger">Mark As Hold</a>
                                  </div>
                                  {/* <!-- ------------- reason for hold --------- --> */}

                                  <div className="form-hold p-3">
                                    <form action="">
                                      <div className="form-group mb-3">
                                        <label className="form-label" for="holdReason">Define Reason</label>
                                        <textarea name="holdReason" id="holdReason" cols="20" rows="5" className="form-control" placeholder="Reason to hold the order or invoice......"></textarea>
                                      </div>
                                      <a href="#" className="btn btn-danger">Hold Now</a>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- payment details ends here  --> */}
                            <div className="accordion-item order-status-wrapper">
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                  <span>Order Status</span>
                                  <span className="status-name"> Preparing </span>
                                </button>
                              </h2>
                              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <div className="status-list-view-wrapper">
                                    <ul className="status-list">
                                      <li className="status-item success">
                                        <h3 className="title">Order Dispatched</h3>
                                        <small>10:35AM From Lucknow, India</small>
                                      </li>
                                      <li className="status-item pending">
                                        <h3 className="title">At Custom Clearance</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                      <li className="status-item blocked">
                                        <h3 className="title">On the Way Via Sea Way</h3>
                                        <small>02 Mar 2024 From Origin, India</small>
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="row">
                                    <div className="form-group px-3 offset-1 col-7">
                                      <select name="orderStatus" id="order-status-select" className="form-select">
                                        <option value="0">Change Order Status</option>
                                        <option value="0">Preparing</option>
                                        <option value="0">Out From Origin</option>
                                        <option value="0">At Origin Custom Office</option>
                                        <option value="0">On the Sea Way</option>
                                        <option value="0" className="text-danger">Order Lossed</option>
                                        <option value="0">At Desitination Custom</option>
                                      </select>
                                      {/* <!-- it only apperace when the order is at delivered status --> */}
                                      <div className="col-12 d-flex gap-3 mt-2">
                                        <input type="checkbox" name="reference-ticket" id="reference-ticket-gen" />
                                        <label for="reference-ticket-gen" className="form-label">Generate Reference Token For Future Order</label>
                                      </div>
                                    </div>
                                    <div className="col-4">
                                      <button className="btn btn-primary">Update Status</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* <!-- section 2 --> */}
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper">
                  <h3 className="title">Recent Transactions</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" className="" />
                        </th>
                        <th tabindex="0">
                          <a data-bs-toggle="modal" data-bs-target="#exampleModal">Name</a>
                        </th>
                        <th tabindex="0">Ticket ID</th>
                        <th tabindex="0">Type/Status</th>
                        <th tabindex="0">Contact</th>
                        <th tabindex="0">Email</th>
                        <th tabindex="0">Description/Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>John Skrew</td>
                        <td>#12548796</td>
                        <td><span className="status">new</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>John Skrew</td>
                        <td>#12548796</td>
                        <td><span className="status">new</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>John Skrew</td>
                        <td>#12548796</td>
                        <td><span className="status">new</span></td>
                        <td>+91 XXXXXXXX 90</td>
                        <td>****@gmail.com</td>
                        <td>Lorem ipsum dolor sit amet....</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            {/* <!-- -------------- --> */}
          </div>
        </div>
      </div>
      {/* <!-- ------------------------------------------------------------
            --------------------- Add Items Up Ticket Modal ---------------------
          -------------------------------------------------------------- --> */}
      <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="addMoreItemsModal" tabindex="-1" aria-labelledby="addMoreItemsLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h1 className="modal-title fs-5 w-100 text-center" id="addMoreItemsLabel">Add Items</h1>
              <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="#" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-10">
                    <label htmlFor="Varient" className="form-label">Brand</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      id="varient"
                      className="form-select">
                      <option value="">Choose...</option>
                      {products.map((productbrand) => (
                        <option key={productbrand.brand} value={productbrand.brand}>{productbrand.brand}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label htmlFor="Varient" className="form-label">Product Name</label>
                    <select
                      name="selectedProductId"
                      value={formData.selectedProductId}
                      onChange={handleChange}
                      id="varient"
                      className="form-select">
                      <option value="">Choose...</option>
                      {products.map((productname) => (
                        <option key={productname.productId} value={productname.productId}>{productname.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label htmlFor="Quantity" className="form-label">Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} id="Quantity" className="form-control" placeholder="0" />
                  </div>
                  <div className="col-6">
                    <label htmlFor="Varient" className="form-label">Treatment</label>
                    <select
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleChange}
                      id="varient"
                      className="form-select">
                      <option value="">Choose...</option>
                      {products.map((producttreatment) => (
                        <option key={producttreatment.treatment} value={producttreatment.treatment}>{producttreatment.treatment}</option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer justify-content-center border-0">
                    <button type="button" onClick={handleClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Add</button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </Modal>
      {/* <!-- Modal --> */}
      <div className="modal ticket-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  <div className="heading-area">
                    <div className="vertical-write">
                      <h2 className="title">Jenell D. Matney</h2>
                      <p className="ticket-id"><i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N</p>
                    </div>
                  </div>
                </div>
                <div className="col-8">
                  <div className="main-content-area">
                    <div className="contact-info-row">
                      <a href="" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                      <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                    </div>
                    <div className="button-grp">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default invoicesss