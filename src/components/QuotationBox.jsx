import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

import axiosInstance from "../axiosInstance";
import ProductPriceModal from "../components/ProductPriceModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//// Auth ////
import { useAuth } from "../auth/AuthContext";

function QuotationBox({ ticket }) {
  const { userId } = useAuth();
  console.log("qua:", ticket);

  // State for modal visibility
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // State for tickets
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(
    ticket && ticket.uniqueQueryId
  );
  const [ticketDetails, setTicketDetails] = useState(null);
  const [addressData, setAddressData] = useState({
    houseNumber: "",
    landmark: "",
    city: "",
    zipCode: "",
    state: "",
    country: "",
  });
  const [serchValue, setserchValue] = useState("");

  const handleInputChange = (e) => {
    setserchValue(e.target.value); // Update state with the input's value
    console.log("Input Value:", e.target.value); // Log the current input value
  };

  const [listView, setListView] = useState(false);
  const [view, setView] = useState(false);
  const [selectedProductIdForPriceLIst, setSelectedProductIdForPriceLIst] =
    useState(0);
  const [prices, setPrices] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const toggleList = () => {
    if (listView) {
      setListView(false);
    } else {
      setListView(true);
    }
  };
  const toggleModel = () => {
    if (view) {
      setView(false);
      handleSubmit(selectedProductIdForPriceLIst);
    } else {
      if (formData.currency) {
        setView(true);
      } else {
        toast.info("Please selecte Currency First");
      }
    }
  };
  const viewListOfProducts = (id, name) => {
    setSelectedProductIdForPriceLIst(id);
    setSelectedProductName(name);
    toggleList();
  };
  const fetchPriceLIst = async () => {
    try {
      const response = await axiosInstance.post(`/product/getProductPrices`, {
        productId: selectedProductIdForPriceLIst,
        ticketId: selectedTicketId,
      });
      setPrices(response.data);
    } catch (e) {
      toast.error("Some Error occures");
    }
  };
  useEffect(() => {
    if (selectedProductIdForPriceLIst > 0 && listView) {
      fetchPriceLIst();
    }
  }, [selectedProductIdForPriceLIst]);

  const openPriceAddModa = (id, name) => {
    setSelectedProductIdForPriceLIst(id);
    setSelectedProductName(name);
    toggleModel();
  };

  // Fetch ticket details when selectedTicketId changes
  useEffect(() => {
    if (selectedTicketId) {
      const fetchTicketDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/${
              selectedTicketId.length < 15 ? "third_party_api/ticket" : "upload"
            }/getTicket/${selectedTicketId}`
          );
          setTicketDetails(response.data.dtoList);
        } catch (err) {
          console.error("Error fetching ticket details:", err);
        }
      };
      fetchTicketDetails();
    }
  }, [selectedTicketId]);

  // Form state for adding products
  const [formData, setFormData] = useState({
    quantity: "",
    selectedProductId: "",
    ticketId: "",
    userId: "",
    price: "0",
    currency: "",
  });

  const handleSubmit = async (productId) => {
    const enteredPrice = priceValues[productId] || "";
    const enteredQuantity = quantityValues[productId] || "";
    const currency = formData.currency || "";
    try {
      const response = await axiosInstance.post("/order/addToOrder", {
        quantity: enteredQuantity,
        productId: productId,
        ticketId: selectedTicketId,
        userId: userId,
        price: enteredPrice,
        currency: currency,
      });
      console.log(productId);
      toast.success("Added to order successfully!");
      fatchaddedproduct();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add order");
    }
    setSelectedProductIdForPriceLIst(0);
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
        const response = await axiosInstance.get("/product/getAllProducts");
        setProducts(response.data.dtoList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, [selectedTicketId]);

  const [orderDetails, setOrderDetails] = useState(null);

  // Fetch order details from apiB when selectedTicketId changes
  useEffect(() => {
    fatchaddedproduct();
  }, []);

  const fatchaddedproduct = () => {
    if (ticket.uniqueQueryId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/order/getOrder/${ticket.uniqueQueryId}`
          );
          setOrderDetails(response.data.dtoList);
        } catch (err) {
          console.error("Error fetching order details:", err);
        }
      };

      fetchOrderDetails();
    }
  };

  // Create shipping address
  useEffect(() => {
    if (selectedTicketId) {
      const fetchAddressDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/address/getAddress/${selectedTicketId}`
          );
          setAddressData(response.data.dto);
        } catch (err) {
          console.error("Error fetching address details:", err);
        }
      };

      fetchAddressDetails();
    }
  }, [selectedTicketId]);

  const [response, setResponse] = useState(null);

  const handleshipChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleshipSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/address/createAddress", {
        houseNumber: String(addressData ? addressData.houseNumber : ""),
        landmark: String(addressData ? addressData.landmark : ""),
        city: String(addressData ? addressData.city : ""),
        zipCode: String(addressData ? addressData.zipCode : ""),
        state: String(addressData ? addressData.state : ""),
        country: String(addressData ? addressData.country : ""),
        ticketId: String(selectedTicketId),
      });
      setResponse(response.data);
      toast.success("Address added successfully!");
    } catch (err) {
      setError(err);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle sending invoice
  const handleSendInvoice = async () => {
    try {
      const response = await axiosInstance.post(
        `/invoice/send-invoice?ticketId=${selectedTicketId}&userId=${userId}`
      );
      toast.success("Invoice sent successfully!");
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    }
  };

  const handleSendQuotation = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/invoice/sendquote?ticketId=${selectedTicketId}&userId=${userId}`
      );
      toast.success("Quotation sent successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error sending quotation:", error);
      toast.error("Failed to send quotation");
      setLoading(false);
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(false); // State to track collapse/expand

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapse state
  };
  const handleDeleteProduct = async (productOrderId) => {
    const response = await axiosInstance.delete(
      `/order/deleteProductOrder/${productOrderId}`
    );
    if (response.data === "deleted") {
      document
        .getElementById(`deleteIcon-${productOrderId}`)
        .classList.remove("fa-lg");
      document
        .getElementById(`deleteIcon-${productOrderId}`)
        .classList.add("fa-bounce");
      document
        .getElementById(`deleteIcon-${productOrderId}`)
        .classList.add("fa-xl");
      toast.success("Product Deleted");
      fatchaddedproduct();
      setTimeout(() => {
        document
          .getElementById(`deleteIcon-${productOrderId}`)
          .classList.remove("fa-bounce");
        document
          .getElementById(`deleteIcon-${productOrderId}`)
          .classList.remove("fa-xl");
        document
          .getElementById(`deleteIcon-${productOrderId}`)
          .classList.add("fa-bounce,fa-lg");
      }, 1000);
    }
  };

  const [selectedProducts, setSelectedProducts] = useState([]); // State to store selected product IDs

  // Handle checkbox change
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      // Check if the product ID is already selected

      console.log(productId);
      if (prevSelected.includes(productId)) {
        // If selected, remove it
        return prevSelected.filter((id) => id !== productId);
      } else {
        // If not selected, add it
        return [...prevSelected, productId];
      }
    });
  };

  // Log selected products to console
  React.useEffect(() => {
    console.log(selectedProducts);
  }, [selectedProducts]);

  const [priceValues, setPriceValues] = useState({});
  const [quantityValues, setQuantityValues] = useState({});

  // Handle price input change
  const handlePriceChange = (e, productId) => {
    setPriceValues((prevState) => ({
      ...prevState,
      [productId]: e.target.value,
    }));
  };

  // Handle quantity input change
  const handleQuantityChange = (e, productId) => {
    setQuantityValues((prevState) => ({
      ...prevState,
      [productId]: e.target.value,
    }));
  };
  //resuble function to convert byte code to image url
  function convertToImage(imageString) {
    const byteCharacters = atob(imageString); // Decode base64 string
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  return (
    <>
      <div className="">
        <div
          className="tab-content vertical-tab-body-wrapper"
          id="v-pills-tabContent"
        >
          {/* <!-- tab one  --> */}
          <div
            className="tab-pane fade show active"
            id="v-pills-ticket1"
            role="tabpanel"
            aria-labelledby="v-pills-ticket1-tab"
            tabindex="0"
          >
            <div className="order-s-details-wrapper-main">
              {ticketDetails ? (
                <div className="order-details-">
                  <div className="">
                    <div className="content-wrapper d-flex justify-content-between">
                      <div
                        className="p-4 border rounded m-2 d-flex flex-column  "
                        style={{ width: "50%", backgroundColor: "#edede9" }}
                      >
                        <span className="  mb-2 text-start text-underline border-bottom d-inline ">
                          Customer Detail
                        </span>
                        <div className="user-info">
                          <div className="d-flex justify-content-start align-items-center gap-2">
                            <img
                              style={{ height: 16 }}
                              src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
                              alt=""
                            />{" "}
                           <p>{ticket?.senderName ? ticket.senderName : ticket?.firstName}</p>

                          </div>
                          <div className="d-flex justify-content-start align-items-center gap-2">
                            <img
                              style={{ height: 16 }}
                              src="https://cdn-icons-png.flaticon.com/128/432/432312.png"
                              alt=""
                            />
                            <p>{ticket?.uniqueQueryId || "N/A"}</p>

                          </div>
                          <div className="d-flex justify-content-start align-items-center gap-2">
                            <img
                              style={{ height: 15 }}
                              src="https://cdn-icons-png.flaticon.com/128/732/732200.png"
                              alt=""
                            />
                            <p>{ticket?.senderEmail || "No Email"}</p>

                          </div>
                          <div className="d-flex justify-content-start align-items-center gap-2">
                            <img
                              style={{ height: 16 }}
                              src="https://cdn-icons-png.flaticon.com/128/186/186239.png"
                              alt=""
                            />
                            <p>
                              {ticket?.senderMobile ||
                                ticket?.mobileNumber ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="border rounded p-4 m-2"
                        style={{ width: "50%", backgroundColor: "#edede9" }}
                      >
                        {ticket?.queryProductName ? (
                          <h3 className="title">{ticket?.queryProductName}</h3>
                        ) : (
                          <h6>{ticket?.productEnquiry}</h6>
                        )}

                        <div className="address-items mt-2 d-flex justify-content-start gap-2">
                          <img
                            className="mt-1"
                            style={{ height: 16 }}
                            src="https://cdn-icons-png.flaticon.com/128/1865/1865269.png"
                            alt=""
                          />
                          <address>
                            {ticket?.senderAddress
                              ? ticket.senderAddress
                              : "No address found"}
                          </address>
                        </div>
                        <div className=""></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
              {/* <!-- ticket details ends here --> */}
              <div className="accordion status-wrappers" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Items Details
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="">
                      <div className="order-lists p-3">
                        <div className="items-wrapper">
                          <div className="list-item header">
                            <p className="title"></p>
                            <p className="cost"></p>
                          </div>
                          {/* <div className="list-item otr-list">
                                                            <p className="item">TicketId: <span>{orderDetails.ticketId}</span></p>
                                                            <p className="item">Quantity : <span>{orderDetails.quantity}</span></p>
                                                            <p className="item">UserId: <span>{orderDetails.userId}</span></p>
                                                        </div> */}
                        </div>
                        {orderDetails &&
                        orderDetails.productOrders &&
                        orderDetails.productOrders.length > 0 ? (
                          <div className="overflow-x-auto d-flex justify-content-center">
                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 px-3 py-2  text-left">
                                    Name
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2  text-left">
                                    Brand
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2  text-left">
                                    Composition
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2  text-left">
                                    Price List
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2  text-center">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {orderDetails.productOrders.map(
                                  (productOrder, index) =>
                                    productOrder.product &&
                                    productOrder.product[0] ? (
                                      <tr
                                        key={productOrder.productorderId}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="border border-gray-300 py-2 px-3 ">
                                          {productOrder.product[0].name}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-3 ">
                                          {productOrder.product[0].brand}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-3 ">
                                          {productOrder.product[0].composition}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-3 text-center">
                                          <div
                                            onClick={() =>
                                              viewListOfProducts(
                                                productOrder.product[0]
                                                  .productId,
                                                productOrder.product[0].name
                                              )
                                            }
                                          >
                                            <i
                                              class="fa-solid fa-table-list fa-xl"
                                              style={{ cursor: "Pointer" }}
                                            ></i>
                                          </div>
                                        </td>
                                        <td className="h-100 border border-gray-300 py-2 px-3 text-center">
                                          <i
                                            onClick={() =>
                                              handleDeleteProduct(
                                                productOrder.productorderId
                                              )
                                            }
                                            id={`deleteIcon-${productOrder.productorderId}`}
                                            className="fa-solid fa-trash fa-lg"
                                            style={{
                                              color: "#ec2222",
                                              cursor: "pointer",
                                            }}
                                          ></i>
                                        </td>
                                      </tr>
                                    ) : (
                                      <tr key={index}>
                                        <td
                                          colSpan="7"
                                          className="border border-gray-300 px-3  text-center"
                                        >
                                          Product details not available
                                        </td>
                                      </tr>
                                    )
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-center">
                            No product Added
                          </div>
                        )}

                        {orderDetails && (
                          <div className="total d-flex justify-content-end">
                            {/* <div className='d-flex'>
                                                        <p className='fw-semibold'>Total:- </p>
                                                        <p>{orderDetails.productOrders[0] && orderDetails.productOrders[0].currency}  {orderDetails.totalPayableAmount}</p>
                                                    </div> */}
                          </div>
                        )}
                        <div className="add-more-products-wrapper m-3">
                          <Button
                            onClick={handleShow}
                            data-bs-toggle="modal"
                            data-bs-target="#addMoreItemsModal"
                            className="btn btn-primary"
                          >
                            Add Product
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* /////////////////shipping address */}
                {/* <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            onClick={toggleCollapse} // Handle click to toggle collapse
                                            aria-expanded={!isCollapsed}
                                            aria-controls="shippingDetils">
                                            Sales/Invoice Details
                                        </button>
                                    </h2>

                                    <div
                                        id="shippingDetils"
                                        className={`accordion-collapse collapse ${isCollapsed ? '' : 'show'}`}
                                        data-bs-parent="#accordionAddressDetails">
                                        {true && ( // Adjust condition if necessary
                                            <div className="p-3">
                                                <form onSubmit={handleshipSubmit}>
                                                    <div className="row g-3 p-3">
                                                        <div className="col-12">
                                                            <label htmlFor="name" className="form-label">Shipping To :</label>
                                                            <input type="text" id="name" className="form-control" placeholder="Eg. Jane Kapoor" />
                                                        </div>
                                                        <div className="col-12">
                                                            <h3 className="fieldset-heading">Shipping Address</h3>
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="hNo" className="form-label">House No./ Street</label>
                                                            <input
                                                                name="houseNumber"
                                                                value={addressData ? addressData.houseNumber : ""}
                                                                onChange={handleshipChange}
                                                                id="hNo"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="landmark" className="form-label">Landmark</label>
                                                            <input
                                                                type="text"
                                                                name="landmark"
                                                                value={addressData ? addressData.landmark : ""}
                                                                onChange={handleshipChange}
                                                                id="landmark"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="city" className="form-label">City</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={addressData ? addressData.city : ""}
                                                                onChange={handleshipChange}
                                                                id="city"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="zipCode" className="form-label">Zip Code</label>
                                                            <input
                                                                type="text"
                                                                name="zipCode"
                                                                value={addressData ? addressData.zipCode : ""}
                                                                onChange={handleshipChange}
                                                                id="zipCode"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="state" className="form-label">State</label>
                                                            <input
                                                                type="text"
                                                                name="state"
                                                                value={addressData ? addressData.state : ""}
                                                                onChange={handleshipChange}
                                                                id="state"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="country" className="form-label">Country</label>
                                                            <input
                                                                type="text"
                                                                name="country"
                                                                value={addressData ? addressData.country : ""}
                                                                onChange={handleshipChange}
                                                                id="country"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <input type="checkbox" id="checkSame" className="form-check-inline" />
                                                            <label htmlFor="checkSame" className="form-label checkSame-Address">Billing address is same as shipping</label>
                                                        </div>
                                                        <div className="col-12">
                                                            <button className="btn btn-primary w-100">Submit Address</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div> */}

                {/* <!-- order items details ends here --> */}
                <div className="d-flex justify-content-center ">
                  {loading ? (
                    <button
                      className="bg-success mt-1"
                      style={{ marginRight: "3px" }}
                    >
                      Sending
                    </button>
                  ) : (
                    <button
                      onClick={handleSendQuotation}
                      className="bg-warning mt-1"
                      style={{ marginRight: "3px" }}
                    >
                      Send Quotation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        className="modal assign-ticket-modal fade rounded"
        id="addMoreItemsModal"
        tabindex="-1"
        aria-labelledby="addMoreItemsLabel"
        aria-hidden="true"
      >
        <div className="modal-header border-0">
          <h1
            className="modal-title fs-5 w-100 text-center"
            id="addMoreItemsLabel"
          >
            Select Products
          </h1>
          <button
            type="button"
            onClick={handleClose}
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <>
          <div className="d-flex justify-content-between px-5">
            <input
              type="text"
              placeholder="Enter product Name"
              value={serchValue}
              onChange={handleInputChange}
              className="p-2 bg-white text-black"
            />

            <div className="d-flex align-items-center">
              <label htmlFor="Currency" className="mx-5">
               Currency 
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                id="currency"
                className="form-control"
                style={{ maxWidth: "200px", fontSize: "15px" }}
              >
                <option value="" disabled>
                  Select Currency
                </option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>
          </div>

          <div className="container mt-3">
            <div className="row">
              {products &&
                products
                  .filter((product) => product.strength)
                  .filter((product) =>
                    serchValue.length > 0
                      ? product.name
                          .toLowerCase()
                          .includes(serchValue.toLowerCase())
                      : true
                  )
                  .filter((product) => product.images !== null)
                  .map((product, index) => (
                    <div
                      key={index}
                      className="col-12 col-md-6 mb-3 d-flex justify-content-center"
                    >
                      <div
                        className="card p-2 position-relative"
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          paddingTop: "20px",
                          height: "auto",
                        }}
                      >
                        {/* Brand Tag positioned at bottom-left corner */}
                        <div
                          className="position-absolute bg-success text-white px-2 py-1"
                          style={{
                            fontSize: "10px",
                            borderTopRightRadius: "4px",
                            borderBottomLeftRadius: "4px",
                            bottom: "-9px", // Move to the bottom with some space
                            left: "-1px", // Align to the left with some space
                            zIndex: "1", // Ensure it appears above other elements
                          }}
                        >
                          {product.brand}
                        </div>

                        <div className="d-flex flex-column flex-md-row align-items-center">
                          {/* Image Section */}
                          <div>
                            <img
                              src={`https://image.rdvision.in/images/getProductImage/${product.productId}`}
                              alt="Product"
                              className="img-fluid rounded"
                              style={{ maxHeight: "80px", marginTop: "10px" }}
                            />
                          </div>

                          {/* Product Details Section */}
                          <div className="ms-2 w-100 ">
                            <strong
                              className="card-title mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              {product.name} {product.Price}
                            </strong>

                            {/* Price and Quantity Input Section */}
                            {/* <div className="input-group mb-1 d-flex justify-content-around" style={{ fontSize: '12px' }}>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm mx-2"
                                                            placeholder="Price"
                                                            style={{ maxWidth: '70px' }}
                                                            value={priceValues[product.productId] || ''}
                                                            onChange={(e) => handlePriceChange(e, product.productId)}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm mx-2"
                                                            placeholder="Quantity"
                                                            style={{ maxWidth: '70px' }}
                                                            value={quantityValues[product.productId] || ''}
                                                            onChange={(e) => handleQuantityChange(e, product.productId)}
                                                        />
                                                    </div> */}
                          </div>

                          <button
                            className="bg-info mt-2 mt-md-0"
                            style={{ height: "30px", fontSize: "12px" }}
                            onClick={() =>
                              openPriceAddModa(product.productId, product.name)
                            }
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </>
      </Modal>

      {/* add price list modal for qouatationn send */}
      <Modal show={view} onHide={handleSubmit} centered>
        <Modal.Header toggleModel>
          <div className="d-flex justify-content-between  w-100">
            <Modal.Title>Add Price List</Modal.Title>
            <Button variant="secondary" onClick={toggleModel}>
              Close
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <ProductPriceModal
            productId={selectedProductIdForPriceLIst}
            productName={selectedProductName}
            onClose={toggleModel}
            ticketId={selectedTicketId}
            currency={formData.currency}
          />
        </Modal.Body>
      </Modal>
      <Modal show={listView} onHide={toggleList} centered>
        <Modal.Header toggleModel>
          <div className="d-flex justify-content-between  w-100">
            <Modal.Title> Price List of :-{selectedProductName}</Modal.Title>
            <Button variant="secondary" onClick={toggleList}>
              Close
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="container mt-3">
            <h3> Prices list</h3>
            <table className="table table-bordered table-striped table-hover shadow-sm">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Price</th>
                </tr>
              </thead>
              {prices.length > 0 ? (
                <tbody>
                  {prices.map((price) => (
                    <tr key={price.priceId}>
                      <td className="text-center align-middle border">
                        {price.quantity} {price.unit}
                      </td>
                      <td className="text-center align-middle border">
                        {price.currency} {price.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No price available
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </Modal.Body>
      </Modal>
      {/* <!-- Modal --> */}
      <div
        className="modal ticket-modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  <div className="heading-area">
                    <div className="vertical-write">
                      <h2 className="title">Jenell D. Matney</h2>
                      <p className="ticket-id">
                        <i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-8">
                  <div className="main-content-area">
                    <div className="contact-info-row">
                      <a href="" className="contact-info phone">
                        <i className="fa-solid fa-phone"></i> +91 9918293747
                      </a>
                      <a className="contact-info email" href="#">
                        <i className="fa-solid fa-envelope-open-text"></i>{" "}
                        example@email.com
                      </a>
                    </div>
                    <div className="button-grp">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button type="button" className="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default QuotationBox;
