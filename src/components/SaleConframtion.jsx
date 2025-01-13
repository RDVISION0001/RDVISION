import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddressForm from '../components/AddressForm';
import Confetti from "react-confetti"; // Import the confetti library



function SaleConframtion(props) {
    const userId = localStorage.getItem("userId");

    const [showConfetti, setShowConfetti] = useState(false);

    // State to store the dropdown options
    const [options, setOptions] = useState([]);

    const [address, setAddress] = useState(null);

    // Initialize selectedTicketId when props.ticketId changes
    const [selectedTicketId, setSelectedTicketId] = useState(props.ticketId);

    useEffect(() => {
        if (props.ticketId) {
            setSelectedTicketId(props.ticketId); // Set selectedTicketId when props.ticketId changes
        }
    }, [props.ticketId]);

    // Get address
    useEffect(() => {
        fetchAddress();
    }, [selectedTicketId]);
    const fetchAddress = async () => {
        if (!selectedTicketId) return;
        try {
            const response = await axiosInstance.get(`/address/getAddress/${selectedTicketId}`);
            setAddress(response.data.dto);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (productId) => {
        const enteredPrice = priceValues[productId] || "";
        const enteredQuantity = quantityValues[productId] || "";
        const currency = formData.currency || "";
        // Validation for empty fields
        if (!currency) {
            toast.error('Currency is required!');
            setLoadingId(null); // Reset loading state
            return;
        }
        if (!enteredPrice) {
            toast.error('Price is required!');
            setLoadingId(null); // Reset loading state
            return;
        }
        if (!enteredQuantity) {
            toast.error('Quantity is required!');
            setLoadingId(null); // Reset loading state
            return;
        }

        // Proceed with the API request
        try {
            setLoadingId(productId); // Set loading state before making the API call
            const response = await axiosInstance.post('/order/addToOrder', {
                quantity: enteredQuantity,
                productId: productId,
                ticketId: selectedTicketId,
                userId: userId,
                price: enteredPrice,
                currency: currency
            });
            toast.success('Added to order successfully!');
            fatchaddedproduct();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to add order');
        } finally {
            setLoadingId(null); // Reset loading state in both success and error cases
        }
    };

    // State for modal visibility
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleClosee = () => setShow(false);
    const handleShow = () => setShow(true);

    const [externalPaymentLink, setExternalPaymentLink] = useState("");

    // State for tickets
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ticketDetails, setTicketDetails] = useState(null);
    const [serchValue, setserchValue] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    const handleInputChange = (e) => {
        setserchValue(e.target.value); // Update state with the input's value
        console.log('Input Value:', e.target.value); // Log the current input value
    };

    // Open the modal
    const handleOpen = () => {
        setShowModal(true);
    };

    // Close the modal
    const handleClose = () => {
        setShowModal(false);
        fetchAddress();
    };

    // payment windows
    useEffect(() => {
        // Call the API on component mount
        axiosInstance.get('/paymentwindow/getAll')
            .then((response) => {
                setOptions(response.data);  // Assuming the response data is an array
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching payment windows:', error);
                setLoading(false);
            });
    }, []);

    // Fetch ticket details when selectedTicketId changes
    useEffect(() => {
        if (!selectedTicketId) return; // Don't fetch if ticketId is not set
        const fetchTicketDetails = async () => {
            try {
                const response = await axiosInstance.get(`/${selectedTicketId.length < 15 ? "third_party_api/ticket" : "upload"}/getTicket/${selectedTicketId}`);
                setTicketDetails(response.data.dtoList);
            } catch (err) {
                console.error('Error fetching ticket details:', err);
            }
        };
        fetchTicketDetails();
    }, [selectedTicketId]);

    // Form state for adding products
    const [formData, setFormData] = useState({
        paymentIntentId: "",
        amount: 0,
        currency: "",
        customerId: "cus_ABC123",
        paymentWindow: "gpay"
    });


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
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/product/getAllProducts');
            setProducts(response.data.dtoList);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const [orderDetails, setOrderDetails] = useState(null);

    // Fetch order details from apiB when selectedTicketId changes
    useEffect(() => {
        fatchaddedproduct();
    }, []);

    const fatchaddedproduct = () => {
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
    };

    const [response, setResponse] = useState(null);

    // Function to handle sending invoice
    const handleSendInvoice = async () => {
        if (orderDetails.productOrders.length > 0) {
            setLoading(true);
            try {
                const response = await axiosInstance.post(
                    `/invoice/save-information?ticketId=${selectedTicketId}&userId=${userId}`,
                    formData
                );
                toast.success("Marked as Sale done");

                // Trigger the confetti animation
                setShowConfetti(true);

                // Stop the confetti after a short delay
                setTimeout(() => setShowConfetti(false), 8000); // Adjust time as needed
            } catch (error) {
                console.error("Error sending invoice:", error);
                toast.error("Failed to send invoice");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Please Add At least one product");
        }
    };


    const [isCollapsed, setIsCollapsed] = useState(false); // State to track collapse/expand

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed); // Toggle the collapse state
    };

    const handleDeleteProduct = async (productOrderId) => {
        const response = await axiosInstance.delete(`/order/deleteProductOrder/${productOrderId}`);
        if (response.data === "deleted") {
            document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-lg");
            document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-bounce");
            document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-xl");
            toast.success("Product Deleted");
            fatchaddedproduct();
            setTimeout(() => {
                document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-bounce");
                document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-xl");
                document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-bounce,fa-lg");
            }, 1000);
        }
    };

    const [selectedProducts, setSelectedProducts] = useState([]); // State to store selected product IDs
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

    // Resuable function to convert byte code to image url
    function convertToImage(imageString) {
        // const byteCharacters = atob(imageString); // Decode base64 string
        // const byteNumbers = new Array(byteCharacters.length);
        // for (let i = 0; i < byteCharacters.length; i++) {
        //     byteNumbers[i] = byteCharacters.charCodeAt(i);
        // }
        // const byteArray = new Uint8Array(byteNumbers);
        // const blob = new Blob([byteArray], { type: 'image/jpeg' });
        // const url = URL.createObjectURL(blob);
        // return url;
    }
    const handlePaymentChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }
    console.log(orderDetails)

    return (
        <>
            <div className="">
                {showConfetti && <Confetti />}
                <div className="tab-content vertical-tab-body-wrapper" id="v-pills-tabContent">
                    {/* Tab One */}
                    <div
                        className="tab-pane fade show active"
                        id="v-pills-ticket1"
                        role="tabpanel"
                        aria-labelledby="v-pills-ticket1-tab"
                        tabIndex="0"
                    >
                        <div className="order-s-details-wrapper-main">
                            {ticketDetails ? (
                                <div className="order-details-">
                                    <div className="">
                                        <div className="content-wrapper d-flex justify-content-between">
                                            <div className="p-4 border rounded m-2">
                                                <h5 className="-title text-center mb-4">Customer Detail</h5>
                                                <div className="user-info">
                                                    <div><strong>Name:</strong> {ticketDetails.senderName ? ticketDetails.senderName : ticketDetails.firstName}</div>
                                                    <div><strong>Ticket ID:</strong> {selectedTicketId}</div>
                                                    <div><strong>Email:</strong> {ticketDetails.senderEmail ? ticketDetails.senderEmail : ticketDetails.email}</div>
                                                    <div><strong>Mobile Number:</strong>{ticketDetails.senderMobile ? ticketDetails.senderMobile : ticketDetails.mobileNumber}</div>
                                                </div>
                                            </div>
                                            <div className="border rounded p-4 m-2">
                                                <h3 className="title">{ticketDetails.queryProductName}</h3>
                                                <div className="address-items mt-2">
                                                    <div>
                                                        {address && (
                                                            <div>
                                                                <p><strong> House Number:</strong> {address.houseNumber}</p>
                                                                <p><strong>Street: </strong> {address.landmark}</p>
                                                                <p><strong>City:</strong> {address.city}</p>
                                                                <p><strong>State:</strong> {address.state}</p>
                                                                <p><strong>Zip Code:</strong> {address.zipCode}</p>
                                                                <p><strong>Country:</strong> {address.country}</p>

                                                            </div>
                                                        )}
                                                        {/* Add the rest of your component here */}
                                                    </div>
                                                </div>
                                                <button onClick={handleOpen}>Add Address</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>wait just second</p>
                            )}

                            {/* Ticket Details Ends Here */}
                            <div className="accordion status-wrappers" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Items Details
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                        <div className="">
                                            <div className="order-lists p-3">
                                                <div className="items-wrapper">
                                                    <div className="list-item header">
                                                        <p className="title"></p>
                                                        <p className="cost"></p>
                                                    </div>
                                                </div>
                                                {orderDetails && orderDetails.productOrders && orderDetails.productOrders.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                                                                    <th className="border border-gray-300 px-3 py-2 text-left">Brand</th>
                                                                    <th className="border border-gray-300 px-3 py-2 text-left">Composition</th>
                                                                    <th className="border border-gray-300 px-3 py-2 text-left">Size</th>
                                                                    <th className="border border-gray-300 px-3 py-2 text-left">Quantity</th>
                                                                    <th className="border border-gray-300 px-3 py-2 text-left">Price</th>
                                                                    <th className="border border-gray-300 px-3 py-2 text-center">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {orderDetails.productOrders.map((productOrder, index) => (
                                                                    productOrder.product && productOrder.product[0] ? (
                                                                        <tr key={productOrder.productorderId} className="hover:bg-gray-50">
                                                                            <td className="border border-gray-300 py-2 px-3">{productOrder.product[0].name}</td>
                                                                            <td className="border border-gray-300 py-2 px-3">{productOrder.product[0].brand}</td>
                                                                            <td className="border border-gray-300 py-2 px-3">{productOrder.product[0].composition}</td>
                                                                            <td className="border border-gray-300 py-2 px-3">{productOrder.product[0].packagingSize}</td>
                                                                            <td className="border border-gray-300 py-2 px-3">{productOrder.quantity}</td>
                                                                            <td className="border border-gray-300 py-2 px-3">{productOrder.totalAmount}</td>
                                                                            <td className="h-100 border border-gray-300 py-2 px-3 text-center">
                                                                                <i
                                                                                    onClick={() => handleDeleteProduct(productOrder.productorderId)}
                                                                                    id={`deleteIcon-${productOrder.productorderId}`}
                                                                                    className="fa-solid fa-trash fa-lg"
                                                                                    style={{ color: "#ec2222", cursor: "pointer" }}
                                                                                ></i>
                                                                            </td>
                                                                        </tr>
                                                                    ) : (
                                                                        <tr key={index}>
                                                                            <td colSpan="7" className="border border-gray-300 px-3 text-center">Product details not available</td>
                                                                        </tr>
                                                                    )
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-center">No product Added</div>
                                                )}

                                                {orderDetails && (
                                                    <div className="total d-flex justify-content-end">
                                                        <div className="d-flex">
                                                            <p className="fw-semibold">Total:- </p>
                                                            <p>{orderDetails.productOrders[0] && orderDetails.productOrders[0].currency} {orderDetails.totalPayableAmount}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="add-more-products-wrapper">
                                                    <Button onClick={handleShow} data-bs-toggle="modal" data-bs-target="#addMoreItemsModal" className="btn btn-primary">
                                                        Add Product
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Add payment details */}
                                <div>
                                    <div className="p-4 border-0 rounded-lg">
                                        <div className="bg-primary text-white p-3 rounded-top">
                                            <h5 className="modal-title">Add Payment</h5>
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-3">
                                                <label htmlFor="transectionid" className="form-label">Transaction ID</label>
                                                <input
                                                    type="text"
                                                    id="transectionid"
                                                    className="form-control"
                                                    name="paymentIntentId"
                                                    value={formData.paymentIntentId}
                                                    onChange={handlePaymentChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="amount" className="form-label">Amount</label>
                                                <input
                                                    type="text"
                                                    id="amount"
                                                    className="form-control"
                                                    name="amount"
                                                    value={formData.amount}
                                                    onChange={handlePaymentChange}
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
                                                        onChange={handlePaymentChange}
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
                                                <label htmlFor="currency" className="form-label">Currency</label>
                                                <select
                                                    id="currency"
                                                    className="form-select"
                                                    name="currency"
                                                    value={formData.currency}
                                                    onChange={handlePaymentChange}
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
                                    </div>
                                </div>

                                {/* Order Items Details Ends Here */}
                                <div className="d-flex justify-content-center">
                                    <button
                                        onClick={handleSendInvoice}
                                        className="btn btn-primary mt-1"
                                        disabled={address === null || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </>
                                        ) : (
                                            "Save Confirmation"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade rounded" id="addMoreItemsModal" tabIndex="-1" aria-labelledby="addMoreItemsLabel" aria-hidden="true">
                <div className="modal-header border-0">
                    <h1 className="modal-title fs-5 w-100 text-center" id="addMoreItemsLabel">Select Products</h1>
                    <button type="button" onClick={handleClosee} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="d-flex justify-content-between px-5">
                    <input
                        type="text"
                        placeholder="Enter product Name"
                        value={serchValue}
                        onChange={handleInputChange}
                        className="p-2 bg-white text-black"
                    />
                    <div className="d-flex align-items-center">
                        <label htmlFor="Currency" className="mx-5">Choose Currency</label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            id="currency"
                            className="form-control"
                            style={{ maxWidth: '100px', fontSize: '15px' }}
                        >
                            <option value="" disabled>Select Currency</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                        </select>
                    </div>
                </div>

                < div className="container mt-3">
                    <div className="row">
                        {products &&
                            products
                                .filter(product =>
                                    serchValue.length > 0
                                        ? product.name.toLowerCase().includes(serchValue.toLowerCase())
                                        : true
                                )
                                .filter((product) => product.images !== null)
                                .map((product, index) => (
                                    <div key={index} className="col-12 col-md-6 mb-3 d-flex justify-content-center">
                                        <div className="card p-2 position-relative" style={{ width: '100%', maxWidth: '300px', paddingTop: '20px', height: 'auto' }}>
                                            <div
                                                className="position-absolute bg-success text-white px-2 py-1"
                                                style={{
                                                    fontSize: '10px',
                                                    borderTopRightRadius: '4px',
                                                    borderBottomLeftRadius: '4px',
                                                    bottom: '-9px',
                                                    left: '-1px',
                                                    zIndex: '1'
                                                }}
                                            >
                                                {product.brand}
                                            </div>
                                            <div className="d-flex flex-column flex-md-row align-items-center">
                                                <div>
                                                    {/* <img
                                                        src={`https://backend.rdvision.in/images/getProductImage/${product.productId}`}
                                                        alt="Product"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '80px', marginTop: '10px' }}
                                                    /> */}
                                                </div>
                                                <div className="ms-2 w-100">
                                                    <h6 className="card-title mb-1" style={{ fontSize: '12px' }}>
                                                        {product.name} {product.Price}
                                                    </h6>
                                                    <div className="input-group mb-1 d-flex justify-content-around" style={{ fontSize: '12px' }}>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm mx-2"
                                                            placeholder="Quantity"
                                                            style={{ maxWidth: '70px' }}
                                                            value={quantityValues[product.productId] || ''}
                                                            onChange={(e) => handleQuantityChange(e, product.productId)}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm mx-2"
                                                            placeholder="Price"
                                                            style={{ maxWidth: '70px' }}
                                                            value={priceValues[product.productId] || ''}
                                                            onChange={(e) => handlePriceChange(e, product.productId)}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    className="bg-info mt-2 mt-md-0 d-flex align-items-center justify-content-center"
                                                    style={{ height: "30px", fontSize: "12px", minWidth: "60px" }}
                                                    onClick={() => handleSubmit(product.productId)}
                                                    disabled={loadingId === product.productId}
                                                >
                                                    {loadingId === product.productId ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        'Add'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                    </div>
                </div>
            </Modal>

            {/* Add Address Modal */}
            <Modal show={showModal} onHide={handleClose} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <AddressForm ticketId={selectedTicketId} handleClose={handleClose} />
                <div className="modal-body">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
}
export default SaleConframtion;
