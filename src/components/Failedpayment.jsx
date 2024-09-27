import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '../axiosInstance';
import { useParams } from 'react-router-dom';


const Failedpayment = () => {
    const { orderid } = useParams(); // Get the order ID from the URL parameters
    const [orderData, setOrderData] = useState(null); // Order data state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        try {
            const response = await axiosInstance.get(`/order/getOrderDetails/${orderid}`);
            setOrderData(response.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError("Failed to load order details. Please try again later.");
        }
    };

    const stripePromise = loadStripe("pk_test_51KpHlnSAxOboMMom0iL0iGQCFoBJm1TpQxShbdJbj7vsqVh8QHWz3LFV66YSJDMRUXuA0UAfl5lddXOcgDlXYhmD00hHgDaIEU");

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
        address: `${orderData.addresss.houseNumber}, ${orderData.addresss.landmark}, ${orderData.addresss.city}, ${orderData.addresss.state}, ${orderData.addresss.zipCode}, ${orderData.addresss.country}`
    };

    const products = orderData.orderDetails.productOrders; // Extract product orders
    const total_price = orderData.orderDetails.totalPayableAmount; // Total price for the order
    const paymentStatus = orderData.orderDetails.paymentStatus; // Payment Status
    const ticketId = orderData.ticketDetail.uniqueQueryId; // Ticket ID
    const queryTime = orderData.ticketDetail.queryTime; // Query Time

    const handlePay = async () => {
        try {
            const stripe = await stripePromise;

            const response = await fetch(`http://localhost:8080/invoice/create-checkout-session/${orderid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ amount: total_price * 100 }) // Convert to cents
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
    };

    // Hardcoded company details
    const companyDetails = {
        name: "RDVISION Pharmaceuticals",
        address: "123 Pharma Street, Varanasi, UP, 281291, India",
        phone: "+91-1234567890",
        email: "contact@rdvision.com"
    };

    return (
        <div className="container mt-5">
            <div className="card border-primary mx-auto" style={{ maxWidth: '800px' }}>
                <div className="card-body text-center">
                    <h2 className="mb-4">Trust Badges</h2>
                    <div id="gallery-images" className="mb-4">
                        {["https://1drv.ms/i/s!AqitzNn5GW7cb3xDT057LNjP4k8?embed=1&width=240&height=210", "https://1drv.ms/i/s!AqitzNn5GW7cbvpal1RJ246qemg?embed=1&width=360&height=303", "https://via.placeholder.com/50"].map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt="Gallery"
                                className="img-fluid rounded-circle "
                                style={{ width: '50px', margin: '0 10px' }}
                            />
                        ))}
                    </div>
                    <div className='d-flex justify-content-center'>

                        <div>
                            {/* Company Information */}
                            <h3>Company Information</h3>
                            <p><strong>Name:</strong> {companyDetails.name}</p>
                            <p><strong>Address:</strong> {companyDetails.address}</p>
                            <p><strong>Phone:</strong> {companyDetails.phone}</p>
                            <p><strong>Email:</strong> {companyDetails.email}</p>

                        </div>
                        <div>
                            {/* Customer Information */}
                            <h3>Customer Information</h3>
                            <p><strong>Name:</strong> {customer.name}</p>
                            <p><strong>Email:</strong> {customer.email}</p>
                            <p><strong>Mobile:</strong> {customer.mobile}</p>
                            <p><strong>Address:</strong> {customer.address}</p>
                        </div>

                    </div>

                    {/* Product Table */}
                    <h2>Product Table</h2>
                    <table className="table table-bordered text-center">
                        <thead className="thead-light">
                            <tr>
                                <th>Product Name</th>
                                <th>Image</th>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((productOrder) => (
                                productOrder.product.map((product) => (
                                    <tr key={product.productId}>
                                        <td>{product.name}</td>
                                        <td>
                                            <img src={product.image} alt={product.name} style={{ width: '50px' }} />
                                        </td>
                                        <td>{product.composition} - {product.treatment}</td>
                                        <td>{productOrder.quantity}</td>
                                        <td>${product.price}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>

                    {/* Total Price */}
                    <div className="font-weight-bold text-primary fw-bold" style={{ fontSize: "25px" }}>
                        Total Price: ${total_price}
                    </div>
                    <div className="mt-3">
                        <button type="button" className="btn btn-primary rounded" onClick={handlePay}>
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Failedpayment