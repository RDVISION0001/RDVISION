import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const ViewInvoice = () => {
    const { orderid } = useParams(); // Get the order ID from the URL parameters
    const [orderData, setOrderData] = useState(null); // Order data state
    const [error, setError] = useState(null); // Error state
    const { baseUrl } = useAuth();
    const [isLive, setIsLive] = useState(true);
    const [currecy, setCurrency] = useState(null);
    const [terms, setTerms] = useState(false);
    const [show, setShow] = useState(false)
    const [selectedimnage, setSalectedImage] = useState(null)
    const [productOrders, setProductOrders] = useState([])

    const handleCheckboxChange = (event) => {
        setTerms(event.target.checked);
    };

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const handleMouseEnter = () => {
        setButtonStyle((prevStyle) => ({
            ...prevStyle,
            backgroundColor: '#0056b3', // Darker shade for hover effect
        }));
    };

    const handleMouseLeave = () => {
        setButtonStyle((prevStyle) => ({
            ...prevStyle,
            backgroundColor: '#007bff', // Original color
        }));
    };

    const [buttonStyle, setButtonStyle] = useState({
        height: '50px',
        width: '150px',
        fontSize: '25px',
        backgroundColor: '#007bff', // Bootstrap primary color
        transition: 'background-color 0.3s ease',
    });

    const fetchOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/order/getOrderDetails/${orderid}`);
            setOrderData(response.data);
            setCurrency(response.data.orderDetails.productOrders[0].currency);
            setProductOrders(response.data.orderDetails.productOrders)
            console.log(response.data.orderDetails.productOrders[0].currency);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError("Failed to load order details. Please try again later.");
        }
    };

    const [address, setAddressData] = useState(null)


    // address
    useEffect(() => {
        if (orderid) {
            const fetchAddressDetails = async () => {
                try {
                    const response = await axiosInstance.get(`/address/getAddress/${orderid}`);
                    setAddressData(response.data.dto);
                } catch (err) {
                    console.error('Error fetching address details:', err);
                }
            };

            fetchAddressDetails();
        }
    }, []);

    const stripePromise = loadStripe("pk_live_51KpHlnSAxOboMMomzgtOknKDOwEg9AysCqs6g0O2e9ETloartosrHcf8qOAwOsChi8s5EYN8UHzNn2VgyKirIE6K00TujZ91YB");

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!orderData) {
        return <div className="text-center">Loading...</div>;
    }

    // Extracting customer and company information from orderData
    const customer = {
        name: orderData.ticketDetail.senderName,
        email: orderData.ticketDetail.senderEmail,
        mobile: orderData.ticketDetail.senderMobile,
        address: orderData.address && `${orderData.addresss.houseNumber}, ${orderData.addresss.landmark}, ${orderData.addresss.city}, ${orderData.addresss.state}, ${orderData.addresss.zipCode}, ${orderData.addresss.country}`
    };

    const products = orderData.orderDetails.productOrders; // Extract product orders
    const total_price = orderData.orderDetails.totalPayableAmount; // Total price for the order

    const handlePay = async () => {
        if (terms) {
            try {
                const stripe = await stripePromise;

                const response = await fetch(`https://rdvision.in/invoice/create-checkout-session/${orderid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isLive: isLive
                    })
                });

                const session = await response.json();

                const { error } = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });

                if (error) {
                    console.error('Stripe checkout error:', error.message);
                }
            } catch (err) {
                console.error('Payment error:', err);
            }
        } else {
            toast.info("Please Agree Terms & Conditions");
        }
    };

    // Hardcoded company details
    const companyDetails = {
        name: "RDVISION Pharmaceuticals",
        address: "123 Pharma Street, Varanasi, UP, 281291, India",
        phone: "+91-1234567890",
        email: "contact@rdvision.com"
    };

    // Flatten products for easier rendering
    const flattenedProducts = products.flatMap((productOrder, orderIndex) =>
        productOrder.product.map((product, productIndex) => ({
            ...product,
            quantity: productOrder.quantity,
            key: `${orderIndex}-${product.productId}-${productIndex}`
        }))
    );

    const viewImage = (image) => {
        setSalectedImage(image)
        setShow(true)
    }

    const close = () => {
        setShow(false)
    }
    console.log(productOrders[0].product)
    return (
        <div className="container-fluid p-5">
            <header className="bg-light text-left p-3">
                <h1 className="text-primary mb-1">BuyMed24.com</h1>
                <p>Cholapur, Varanasi, Uttar Pradesh, India, 221101</p>
                <p>Email: invoice@buymed24.com</p>
                <p>Helpline No: <a href="tel:+13189366091">+1 (318) 936-6091</a></p>
            </header>

            <section className="quote-details mb-3">
                <div className="text-end">
                    <p className="mb-0">Date: {new Date().toLocaleDateString()}</p>
                    <p className="mb-0">Quotation ID: {orderData.ticketDetail.uniqueQueryId}</p>
                </div>

                <p>To</p>
                <p>{customer.name}</p>
                <p>{orderData.addresss ? customer.address:"Address Not Available"}</p>
                {orderData.addresss ?<button type="button" class="btn btn-primary rounded" onclick="addAddress()">Edit</button>:<button type="button" class="btn btn-primary rounded" onclick="addAddress()">Add Address</button>}
                <p>{customer.mobile}</p>
            </section>

            <section className="product-details">
                <div className='fw-bold m-3 text-center' style={{ fontSize: "20px" }}>Order Details</div>
                <table className="table table-bordered table-hover text-center">
                    <thead className="thead-light">
                        <tr>
                            <th>S.No</th>
                            <th>Product Name</th>
                            <th>Images</th>
                            <th>Product Description</th>
                            <th>Qty</th>
                            {/* <th>Price / Unit</th> */}
                            <th>Total Amount ({currecy})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productOrders.map((productOrder, index) => (
                            <tr key={index + 1}>
                                <td className='border'>{index + 1}</td>
                                <td className='border'>
                                    {productOrder.product[0].name}
                                </td>
                                <td className='border'>
                                    {productOrder.product[0].images && productOrder.product[0].images.map((image, index) =>
                                        <img key={index} style={{ maxHeight: "30px" }} onClick={() => viewImage(image)} src={image} alt="" />
                                    )}
                                </td>
                                <td className='border'>{productOrder.product[0].composition} - {productOrder.product[0].treatment}</td>
                                <td className='border'>{productOrder.quantity}</td>
                                {/* <td className='border'>{product.price}</td> */}
                                <td className='border'>{productOrder.totalAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Total Price */}
            <div className="total mb-3">
                <p className="font-weight-bold text-end">Total Price: {currecy} {total_price}</p>
            </div>

            <div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={terms}
                        onChange={handleCheckboxChange}
                        id="flexCheckDefault"
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Agree to our <a href="/terms" target='_blank'>Terms & Conditions</a>
                    </label>
                </div>
            </div>

            <div className="mt-3 text-center">
                <div className="mt-3">
                    <button
                        type="button"
                        style={buttonStyle}
                        className="btn rounded"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handlePay}
                    >
                        Pay Now
                    </button>
                </div>
            </div>
            <Modal show={show} onHide={close} className="modal assign-ticket-modal fade " id="addMoreItemsModal" tabindex="-1" aria-labelledby="addMoreItemsLabel" aria-hidden="true">
                <div className='d-flex justify-content-center'>
                    <img src={selectedimnage} style={{ maxHeight: "400px", maxWidth: "700px" }} alt="" />
                </div>
            </Modal>
        </div>
    );
};

export default ViewInvoice;