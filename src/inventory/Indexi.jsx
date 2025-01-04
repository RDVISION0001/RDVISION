import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Form, Modal, Button, FormLabel } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
// Authentication context
import { useAuth } from '../auth/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logout from '../auth/logout';
import { FaPen } from 'react-icons/fa';
import axios from 'axios';
import Oreder_update from '../components/Oreder_update'

function Indexi() {
  const { roleName, userId } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [filter, setFilter] = useState('all'); // Default to "all"
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [tracking, setTracking] = useState("");
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(0)
  const [isImageUplaoderOpen, setIsImageUploadeOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSending, setIsSending] = useState(false)
  const [isUplaoded, setIsUploaded] = useState(false)
  const [files, setFiles] = useState("");
  const [imageUrlToSend, setImageUrlToSend] = useState("")
  const [isUpdateOPen, setIsUpdateOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(0)
  const [isImageOpen, setIsIMageOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selecteOrderProductName, setSelectedOrderProductName] = useState("")
  const [selectedOrderProductQuantity, setselectedOrderProductQuantity] = useState("")
  const [selectedOrderProductDose, setSelectedOrderProductDose] = useState("")

  const openImage = (image) => {
    let newtext = image.replace("backend", "image")
    let newImage = newtext.replace("getChatImageById", "getChatImageGoodQualityById")
    console.log(newImage)
    setIsIMageOpen(true)
    setSelectedImage(newImage)
  }

  const closeImge = () => {
    setIsIMageOpen(false)
    setSelectedImage("")
  }

  const [copiedInvoiceId, setCopiedInvoiceId] = useState(null);

  const handleCopy = (invoice) => {
    console.log(invoice)
    const textToCopy = `${invoice.customerName}, ${invoice.street}, ${invoice.city}, ${invoice.state}, ${invoice.zipCode}, ${invoice.country}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedInvoiceId(invoice.orderId); // Set the copied invoice ID
      setTimeout(() => setCopiedInvoiceId(null), 2000); // Reset after 2 seconds
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFiles(reader.result.split(",")[1]); // Store the base64 string of the file
      setPreviewUrl(reader.result.split(",")[1])
      handleUplaodImage(reader.result.split(",")[1])
    };

    if (file) {
      reader.readAsDataURL(file); // Convert the file to a Base64 string
    }
  };

  const openImageUploader = (id) => {
    setIsImageUploadeOpen(true)
    setSelectedOrderId(id)
  }
  // Fetch careers data when the modal is opened
  const handleShowModal = (invoice) => {
    setCurrentInvoiceId(invoice.id);
    setSelectedOrderId(invoice.orderId)
    setTracking("");
    setShowTrackingModal(true);
  };

  const handleCloseModal = () => {
    // Reset modal-specific states
    setTracking("");
    setSelectedOrderId(0)         // Reset tracking number
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


      const response = await axiosInstance.put(`/inventory/addTrackingNumber`, {
        trackingNumber: tracking,
        orderId: currentInvoiceId,
      });

      toast.success(response.data.message || "Tracking added successfully!");
      handleCloseModal();
      fetchOrders()
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

    // fetchInvoices();
    fetchOrders()
  }, []);

  const fetchOrders = async () => {
    const response = await axiosInstance.get('/inventory/getAllOrders')
    setOrders(response.data)
  }

  // API call to verify invoice
  const handleVerifyInvoice = async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`/invoice/verifyInvoiceByAdmin/${invoiceId}`);
      toast.success(response.data.message || 'Invoice verified successfully!', { autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify invoice', { autoClose: 3000 });
    }
  };

  const [editing, setEditing] = useState({ column: null, rowIndex: null });
  const [tempData, setTempData] = useState({});

  const handleDoubleClick = (column, rowIndex) => {
    setEditing({ column, rowIndex }); // This sets the specific cell to be editable
  };

  const handleChange = (e, column, rowIndex) => {
    const value = e.target.innerText;

    setTempData((prev) => ({
      ...prev,
      [`${rowIndex}-${column}`]: value, // Update only the specific cell
    }));
  };

  const handleBlur = () => {
    setEditing({ column: null, rowIndex: null }); // Reset the editing state
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

  function convertToImage(imageString) {
    const byteCharacters = atob(imageString); // Decode base64 string
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    return url;

  }
  const handleUplaodImage = async (imageData) => {
    setIsSending(true)
    try {
      const response = await axios.post('https://backend.rdvision.in/images/uplaodChatImage', {
        imageData: imageData
      })
      setImageUrlToSend(response.data)
      setIsSending(false)
      setIsUploaded(true)

    }

    catch (e) {
      setIsSending(false)
    }
  }
  const saveShippingLabel = async () => {
    await axiosInstance.put("/inventory/addShippingLabel", {
      orderId: selectedOrderId,
      imageUrl: imageUrlToSend
    })
    setIsImageUploadeOpen(false)
    fetchOrders()
  }

  const oepnUpdate = (id, orderId, name, quantity, dose) => {
    setIsUpdateOpen(true)
    setSelectedOrderId(orderId)
    setSelectedProductId(id)
    setSelectedOrderProductName(name)
    setselectedOrderProductQuantity(quantity)
    setSelectedOrderProductDose(dose)
  }
  const closeUpdate = () => {
    setIsUpdateOpen(false)
    setSelectedOrderId(0)
    setSelectedProductId(0)
    fetchOrders()
  }


  return (
    <>
      <section className="followup-table-section py-3">
        <div className="m-3">
          <div className="d-flex justify-content-between">
            {/* Filter Buttons */}
            <div className="mb-3 d-flex justify-content-start gap-3">
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
                  {/* <i className="fa-solid fa-power-off text-danger" style={{ fontSize: '2rem' }}></i> */}
                  <span className="nav-text cursor-pointer text-danger fw-bold"><Logout /></span>
                </Link>
              </p>
            )}
          </div>

          {/* Invoice Table */}
          <div className="followups-table table-responsive table-height">
            <table className="table table-bordered table-hover table-sm excel-table" style={{ border: '2px solid #000' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th className="border-dark" style={{ backgroundColor: '#FFC300' }}>S.No.</th>
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
                  <th className="border-dark text-center border p-1" style={{ backgroundColor: '#FFC300' }}>Product Details</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice().reverse().map((invoice, index) => (
                  <tr key={invoice.invoiceId}>
                    <td className="border-dark border text-center">{index + 1}</td>
                    <td className="border-dark border text-center">{invoice.orderId || "N/A"}</td>
                    <td className="border-dark border text-center">{formatDate(invoice.orderReceivedDate)}</td>
                    <td className='border border-dark  text-center'>
                      {invoice.trackingNumber ? (
                        <div >
                          {invoice.trackingNumber}
                          <div className='d-flex justify-content-end m-3 text-primary'>
                            <span onClick={() => handleShowModal(invoice)}>edit</span>
                          </div>
                        </div>
                      ) : (
                        <Button variant="warning rounded" onClick={() => handleShowModal(invoice)}>
                          Add Tracking
                        </Button>
                      )}
                    </td>
                    <td className={`border-dark border text-center ${!invoice.trackingStatus ? 'text-danger' : ''}`}>
                      {invoice.trackingStatus || 'Inactive'}
                    </td>
                    <td className="border-dark border text-center">
                      {invoice.shippingLabel ? (
                        <div className="d-flex align-items-center justify-content-between">
                          {/* Display the shipping label image */}
                          <img
                            src={invoice.shippingLabel}
                            className="img-fluid"
                            style={{ height: "30px", maxWidth: "100px" }}
                            alt="Shipping Label"
                            onClick={() => openImage(invoice.shippingLabel)}
                          />
                          {/* Edit button */}
                          <button
                            className="btn btn-transparent text-primary p-0 ms-2"
                            onClick={() => openImageUploader(invoice.id)}
                            style={{ border: "none", backgroundColor: "transparent" }}
                          >
                            edit
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                          onClick={() => openImageUploader(invoice.id)}
                          style={{ height: "40px", width: "40px", borderRadius: "50%" }}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/6176/6176491.png"
                            style={{ height: "20px" }}
                            alt="Upload Icon"
                          />
                        </button>
                      )}
                    </td>

                    <td className="border-dark border text-center">
                      {invoice.customerName}
                    </td>
                    <td className="border-dark border text-center">{invoice.street || "N/A"}</td>
                    <td className="border-dark border text-center">{invoice.city || "N/A"}</td>
                    <td className="border-dark border text-center">{invoice.state || "N/A"}</td>
                    <td className="border-dark border text-center">{invoice.zipCode || "N/A"}</td>
                    <td className="border-dark border text-center">
                      <img src={getFlagUrl(invoice.country ? invoice.country : "NA")} alt="" /> {invoice.country}
                      <button
                        className={`btn  rounded ${copiedInvoiceId === invoice.orderId ? "btn-success" : "btn-warning"}`}
                        style={{ width: "70px" }}
                        onClick={() => handleCopy(invoice)}
                      >
                        {copiedInvoiceId === invoice.orderId ? "Copied" : "Copy"}
                      </button>
                    </td>
                    <td className="text-center border-dark border">
                      <table className="table-bordered">
                        <thead>
                          <tr>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Name</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Quantity</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Doses</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Rate/Qty</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Total Goods Cost</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Shipping Charges</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Total Cost</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Paid Amount</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Due Amount</th>
                            <th style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.orderDetails.map((order, i) => (
                            <tr key={i}>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark border text-center p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'productName'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('productName', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'productName', i)}
                              >
                                {tempData[`${i}-productName`] || order.productName}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark border text-center p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'quantity'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('quantity', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'quantity', i)}
                              >
                                {tempData[`${i}-quantity`] || order.quantity || 'N/A'}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark border text-center p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'does'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('does', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'does', i)}
                              >
                                {tempData[`${i}-does`] || order.does || 'N/A'}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark text-center border p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'rate'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('rate', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'rate', i)}
                              >
                                INR {tempData[`${i}-rate`] || order.rate}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark text-center border p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'totalGoodsCost'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('totalGoodsCost', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'totalGoodsCost', i)}
                              >
                                INR {tempData[`${i}-totalGoodsCost`] || order.totalGoodsCost}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark text-center border p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'shippingCharge'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('shippingCharge', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'shippingCharge', i)}
                              >
                                INR {tempData[`${i}-shippingCharge`] || order.shippingCharge || 'N/A'}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark text-center border p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'totalCost'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('totalCost', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'totalCost', i)}
                              >
                                INR {tempData[`${i}-totalCost`] || order.totalCost}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark text-center border p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'paidAmount'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('paidAmount', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'paidAmount', i)}
                              >
                                INR {tempData[`${i}-paidAmount`] || order.paidAmount}
                              </td>
                              <td
                                style={{ width: '50px', whiteSpace: 'nowrap' }}
                                className="border-dark text-center border p-1"
                                contentEditable={editing.rowIndex === i && editing.column === 'dueAmount'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => handleDoubleClick('dueAmount', i)}
                                onBlur={handleBlur}
                                onInput={(e) => handleChange(e, 'dueAmount', i)}
                              >
                                INR {tempData[`${i}-dueAmount`] || order.dueAmount}
                              </td>
                              <td style={{ width: '50px', whiteSpace: 'nowrap' }} className="border-dark text-center border p-1">
                                <button
                                  onClick={() => openUpdate(order.id, invoice.orderId, order.productName, order.quantity, order.does)}
                                  className='bg-warning text-black'
                                >
                                  Add
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>

                    {/* <td className="border-dark border text-center">{invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}</td> */}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Add Tracking Modal */}
        <Modal show={showTrackingModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Tracking Number for Order no. : {selectedOrderId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formTrackingNumber">
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
      <Modal
        show={isImageUplaoderOpen}
        onHide={() => setIsImageUploadeOpen(false)}
        dialogClassName=""
        centered={false}
        className=""
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <FormLabel className="mb-3 text-black">Upload Image to Send</FormLabel>
          <div
            style={{
              width: "300px",
              height: "200px",
              position: "relative", // To position the pen icon over the image
              border: previewUrl ? "none" : "2px dashed black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              marginBottom: "10px",
              cursor: "pointer",
              overflow: "hidden", // To ensure image doesn't overflow
            }}
            onClick={() => document.getElementById("fileUpload").click()}
          >
            {previewUrl ? (
              <>
                <img
                  src={convertToImage(previewUrl)}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover", // Ensures image fits nicely
                  }}
                />
                <FaPen
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    color: "white",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    padding: "5px",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                />
              </>
            ) : (
              <span className="text-black">Click to Upload Image</span>
            )}
          </div>
          <input
            type="file"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          {isSending && <button>Uploading....</button>}
          {isUplaoded && <button onClick={saveShippingLabel}>Save Label</button>}
        </Modal.Body>
      </Modal>

      {/* Add Tracking Modal */}
      <Modal show={isUpdateOPen} onHide={closeUpdate}>
        <Modal.Header closeButton>
          <Modal.Title> Order no. : {selectedOrderId}</Modal.Title>

        </Modal.Header>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Field</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Product Name</strong></td>
                <td>{selecteOrderProductName}</td>
              </tr>
              <tr>
                <td><strong>Quantity</strong></td>
                <td>{selectedOrderProductQuantity}</td>
              </tr>
              <tr>
                <td><strong>Dose</strong></td>
                <td>{selectedOrderProductDose} Mg</td>
              </tr>
            </tbody>
          </table>
        </div>


        <Modal.Body>
          <Oreder_update productId={selectedProductId} closeFunction={closeUpdate} />
        </Modal.Body>

      </Modal>

      <Modal show={isImageOpen} onHide={closeImge}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-center'>

            <img
              style={{

                objectFit: "contain",
                alignItems: "center"
              }}
              src={selectedImage}
              alt="Selected"
            />
          </div>

        </Modal.Body>

      </Modal>
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

