import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';


import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//// Auth ////
import { useAuth } from '../auth/AuthContext';

function InvoiceBox(props) {
    const { userId } = useAuth();

    // State for modal visibility
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // State for tickets
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(props.ticketId);
    const [ticketDetails, setTicketDetails] = useState(null);
    const [addressData, setAddressData] = useState({
        houseNumber: '',
        landmark: '',
        city: '',
        zipCode: '',
        state: '',
        country: '',
    });
    const [serchValue, setserchValue] = useState("")

    const handleInputChange = (e) => {
        setserchValue(e.target.value); // Update state with the input's value
        console.log('Input Value:', e.target.value); // Log the current input value
    };



    // Fetch ticket details when selectedTicketId changes
    useEffect(() => {
        if (selectedTicketId) {
            const fetchTicketDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/${selectedTicketId.length < 15 ? "third_party_api/ticket" : "upload"}/getTicket/${selectedTicketId}`);
                    setTicketDetails(response.data.dtoList);
                } catch (err) {
                    console.error('Error fetching ticket details:', err);
                }
            };
            fetchTicketDetails();
        }
    }, [selectedTicketId]);



    // Form state for adding products
    const [formData, setFormData] = useState({
        quantity: '',
        selectedProductId: '',
        ticketId: '',
        userId: '',
        price: '0',
        currency: ''
    });



    const handleSubmit = async (productId) => {
        const enteredPrice = priceValues[productId] || "";
        const enteredQuantity = quantityValues[productId] || "";
        const currency = formData.currency || "";
        // Validation for empty fields
        if (!currency) {
            toast.error('Currency is required!');
            return;
        }
        if (!enteredPrice) {
            toast.error('Price is required!');
            return;
        }
        if (!enteredQuantity) {
            toast.error('Quantity is required!');
            return;
        }

        // Proceed with the API request
        try {
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
        fatchaddedproduct()
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
    }

    // Create shipping address
    useEffect(() => {
        if (selectedTicketId) {
            const fetchAddressDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/address/getAddress/${selectedTicketId}`);
                    setAddressData(response.data.dto);
                } catch (err) {
                    console.error('Error fetching address details:', err);
                }
            };

            fetchAddressDetails();
        }
    }, [selectedTicketId]);



    const [response, setResponse] = useState(null);

    const handleshipChange = (e) => {
        setAddressData({
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
                houseNumber: String(addressData ? addressData.houseNumber : ""),
                landmark: String(addressData ? addressData.landmark : ""),
                city: String(addressData ? addressData.city : ""),
                zipCode: String(addressData ? addressData.zipCode : ""),
                state: String(addressData ? addressData.state : ""),
                country: String(addressData ? addressData.country : ""),
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
            const response = await axiosInstance.post(`/invoice/send-invoice?ticketId=${selectedTicketId}&userId=${userId}`);
            toast.success('Invoice sent successfully!');
        } catch (error) {
            console.error('Error sending invoice:', error);
            toast.error('Failed to send invoice');
        }
    };

    const handleSendQuotation = async () => {
        try {
            const response = await axiosInstance.post(`/invoice/send_quotation?ticketId=${selectedTicketId}&userId=${userId}`);
            toast.success('Quotation sent successfully!');
        } catch (error) {
            console.error('Error sending quotation:', error);
            toast.error('Failed to send quotation');
        }
    };

    const [isCollapsed, setIsCollapsed] = useState(false); // State to track collapse/expand

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed); // Toggle the collapse state
    };
    const handleDeleteProduct = async (productOrderId) => {
        const response = await axiosInstance.delete(`/order/deleteProductOrder/${productOrderId}`)
        if (response.data === "deleted") {
            document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-lg")
            document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-bounce")
            document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-xl")
            toast.success("Product Deleted")
            fatchaddedproduct()
            setTimeout(() => {
                document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-bounce")
                document.getElementById(`deleteIcon-${productOrderId}`).classList.remove("fa-xl")
                document.getElementById(`deleteIcon-${productOrderId}`).classList.add("fa-bounce,fa-lg")

            }, 1000)
        }

    }


    const [selectedProducts, setSelectedProducts] = useState([]); // State to store selected product IDs

    // Handle checkbox change
    const handleCheckboxChange = (productId) => {
        setSelectedProducts(prevSelected => {
            // Check if the product ID is already selected

            console.log(productId)
            if (prevSelected.includes(productId)) {
                // If selected, remove it
                return prevSelected.filter(id => id !== productId);
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


    return (
        <>
            <div className="">
                <div className="tab-content vertical-tab-body-wrapper" id="v-pills-tabContent">
                    {/* <!-- tab one  --> */}
                    <div className="tab-pane fade show active" id="v-pills-ticket1" role="tabpanel" aria-labelledby="v-pills-ticket1-tab" tabindex="0">
                        <div className="order-s-details-wrapper-main">
                            {ticketDetails ? (
                                <div className="order-details-">
                                    <div className="">
                                        <div className="content-wrapper d-flex justify-content-between">
                                            <div className='p-4 border rounded m-2'>
                                                <h5 className="-title text-center mb-4">Customer Detail</h5>
                                                <div className="user-info">
                                                    <div><strong>Name:</strong> {props.name}</div>
                                                    <div><strong>Ticket ID:</strong> {selectedTicketId}</div>
                                                    <div><strong>Email:</strong> {props.email}</div>
                                                    <div><strong>Mobile Number:</strong> {props.mobile}</div>
                                                </div>
                                            </div>
                                            <div className='border rounded p-4 m-2'>
                                                <h3 className="title">{ticketDetails.queryProductName}</h3>
                                                <div className="address-items mt-2">
                                                    <small>Billing Address</small>
                                                    <address>
                                                        {ticketDetails.senderAddress ? ticketDetails.senderAddress : "No address found"}
                                                    </address>

                                                </div>
                                                <div className="address-items">
                                                    <small>Delivery Address</small>
                                                    {addressData && <address>
                                                        {addressData ? ` ${addressData && addressData.houseNumber},
                                                        ${addressData && addressData.landmark},
                                                        ${addressData && addressData.city},
                                                        ${addressData && addressData.state},
                                                        ${addressData && addressData.country},
                                                        ${addressData && addressData.zipCode}` : "No adress added"}
                                                    </address>}                                            </div>
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
                                <div className='text-danger'> !Impotent Before Sending Invoice Make sure every Product is added with proper <span className='fw-bold'>Quantity and Price</span></div>

                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Items Details</button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
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
                                                {orderDetails && orderDetails.productOrders && orderDetails.productOrders.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <th className="border border-gray-300 px-3 py-2  text-left">Name</th>
                                                                    <th className="border border-gray-300 px-3 py-2  text-left">Brand</th>
                                                                    <th className="border border-gray-300 px-3 py-2  text-left">Composition</th>
                                                                    <th className="border border-gray-300 px-3 py-2  text-left">Size</th>
                                                                    <th className="border border-gray-300 px-3 py-2  text-left">Quantity</th>
                                                                    <th className="border border-gray-300 px-3 py-2  text-left">Price</th>
                                                                    <th className="border border-gray-300 px-3 py-2  text-center">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {orderDetails.productOrders.map((productOrder, index) => (
                                                                    productOrder.product && productOrder.product[0] ? (
                                                                        <tr key={productOrder.productorderId} className="hover:bg-gray-50">
                                                                            <td className="border border-gray-300 py-2 px-3 ">{productOrder.product[0].name}</td>
                                                                            <td className="border border-gray-300 py-2 px-3 ">{productOrder.product[0].brand}</td>
                                                                            <td className="border border-gray-300 py-2 px-3 ">{productOrder.product[0].composition}</td>
                                                                            <td className="border border-gray-300 py-2 px-3 ">{productOrder.product[0].packagingSize}</td>
                                                                            <td className="border border-gray-300 py-2 px-3 ">{productOrder.quantity}</td>
                                                                            <td className="border border-gray-300 py-2 px-3 ">{productOrder.totalAmount}</td>
                                                                            <td className='h-100 border border-gray-300 py-2 px-3 text-center'>
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
                                                                            <td colSpan="7" className="border border-gray-300 px-3  text-center">Product details not available</td>
                                                                        </tr>
                                                                    )
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className='d-flex justify-content-center'>No product Added</div>
                                                )}

                                                {orderDetails && <div className="total d-flex justify-content-end">
                                                    <div className='d-flex'>
                                                        <p className='fw-semibold'>Total:- </p>
                                                        <p>{orderDetails.productOrders[0] && orderDetails.productOrders[0].currency}  {orderDetails.totalPayableAmount}</p>
                                                    </div>
                                                </div>}
                                                <div className="add-more-products-wrapper ">
                                                    <Button onClick={handleShow} data-bs-toggle="modal" data-bs-target="#addMoreItemsModal" className="btn btn-primary">Add Product</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* /////////////////shipping address */}
                                <div className="accordion-item">
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
                                </div>

                                {/* <!-- order items details ends here --> */}
                                <div className='d-flex justify-content-center '>
                                    {/* <button onClick={handleSendQuotation} className='bg-warning mt-1' style={{ marginRight: "3px" }}>Send Quotation</button> */}
                                    <button onClick={handleSendInvoice} className='bg-primary mt-1'>Send Invoice</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade rounded" id="addMoreItemsModal" tabindex="-1" aria-labelledby="addMoreItemsLabel" aria-hidden="true">

                <div className="modal-header border-0">
                    <h1 className="modal-title fs-5 w-100 text-center" id="addMoreItemsLabel">Select Products</h1>
                    <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>


                <>
                    <div className='d-flex justify-content-between px-5'>
                        <input
                            type='text'
                            placeholder='Enter product Name'
                            value={serchValue}
                            onChange={handleInputChange}
                            className='p-2 bg-white text-black'
                        />

                        <div className='d-flex align-items-center'>
                            <label htmlFor="Currency" className='mx-5'>Choose Currency</label>
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

                    <div className="container mt-3">
                        <div className="row">
                            {products && products
                                .filter(product =>
                                    serchValue.length > 0
                                        ? product.name.toLowerCase().includes(serchValue.toLowerCase())
                                        : true
                                )
                                .filter((product) => product.images !== null).map((product, index) => (
                                    <div key={index} className="col-12 col-md-6 mb-3 d-flex justify-content-center">
                                        <div className="card p-2 position-relative" style={{ width: '100%', maxWidth: '300px', paddingTop: '20px', height: 'auto' }}>
                                            {/* Brand Tag positioned at bottom-left corner */}
                                            <div
                                                className="position-absolute bg-success text-white px-2 py-1"
                                                style={{
                                                    fontSize: '10px',
                                                    borderTopRightRadius: '4px',
                                                    borderBottomLeftRadius: '4px',
                                                    bottom: '-9px', // Move to the bottom with some space
                                                    left: '-1px', // Align to the left with some space
                                                    zIndex: '1' // Ensure it appears above other elements
                                                }}
                                            >
                                                {product.brand}
                                            </div>

                                            <div className="d-flex flex-column flex-md-row align-items-center">
                                                {/* Image Section */}
                                                <div>
                                                    <img
                                                        src={product.images && product.images[0]}
                                                        alt="Product"
                                                        className="img-fluid rounded"
                                                        style={{ maxWidth: '60px', marginTop: '10px' }}
                                                    />
                                                </div>

                                                {/* Product Details Section */}
                                                <div className="ms-2 w-100 ">
                                                    <h6 className="card-title mb-1" style={{ fontSize: '12px' }}>
                                                        {product.name} {product.Price}
                                                    </h6>

                                                    {/* Price and Quantity Input Section */}
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
                                                    className='bg-info mt-2 mt-md-0'
                                                    style={{ height: "30px", fontSize: "12px" }}
                                                    onClick={() => handleSubmit(product.productId)}
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
export default InvoiceBox;