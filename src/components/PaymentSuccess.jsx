import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Confetti from 'react-confetti';
import Paysuccess from '../assets/notification/Paysuccess.mp3';
import { useParams } from 'react-router-dom';

const PaymentSuccess = () => {
    const { orderid } = useParams();
    const [showConfetti, setShowConfetti] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`/order/getOrderDetails/${orderid}`);
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Failed to load order details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const audio = new Audio(Paysuccess);
        audio.play().catch((error) => {
            console.error("Failed to play sound:", error);
        });

        setShowConfetti(true);
        fetchData();

        const confettiTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 5000); // Hide confetti after 5 seconds

        return () => {
            audio.pause();
            clearTimeout(confettiTimer);
            setShowConfetti(false);
        };
    }, [orderid]);

    const triggerFlowerBlast = () => {
        const followerBoom = document.querySelector('.follower-boom');
        const successIcon = document.getElementById('success');

        if (successIcon) {
            const { top, left, width, height } = successIcon.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            for (let i = 0; i < 20; i++) {
                const flower = document.createElement('div');
                flower.className = 'flower';
                flower.style.left = `${centerX}px`;
                flower.style.top = `${centerY}px`;
                flower.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
                flower.style.setProperty('--y', `${(Math.random() - 0.5) * 200}px`);

                followerBoom.appendChild(flower);

                setTimeout(() => {
                    followerBoom.removeChild(flower);
                }, 5000);
            }
        }
    };

    useEffect(() => {
        if (orderDetails) {
            triggerFlowerBlast(); // Trigger flower blast effect after order details are fetched
        }
    }, [orderDetails]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>; // Display error message
    }

    const { orderDetails: order, addresss } = orderDetails || {};

    return (
        <div className="order-confirmation-container container mt-5">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="row">
                <div className="col-lg-8 col-md-10 col-sm-12 mx-auto p-4">
                    <h2 className="thank-you">Thank you for your purchase! <i id='success' className="fa-solid fa-circle-check fa-beat fa-2xl" style={{ color: "#45d408" }}></i></h2>
                    <p>Your order will be processed within 24 hours during working hours. We will notify you once your items have been shipped.</p>

                    <h4 className="mt-4">Shipping Address:</h4>
                    {addresss && (
                        <ul className="list-unstyled">
                            <li><strong>House Number:</strong> {addresss.houseNumber}</li>
                            <li><strong>Landmark:</strong> {addresss.landmark}</li>
                            <li><strong>City:</strong> {addresss.city}</li>
                            <li><strong>State:</strong> {addresss.state}</li>
                            <li><strong>Country:</strong> {addresss.country}</li>
                            <li><strong>Zip Code:</strong> {addresss.zipCode}</li>
                        </ul>
                    )}
                    <div className="order-summary bg-light p-4 rounded">
                        <h4 className="mb-3">Order Summary</h4>

                        {order && order.productOrders && order.productOrders.map((productOrder, index) => (
                            <div key={index} className="order-item d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
                                <div className="item-details d-flex align-items-center">
                                    {productOrder.product && productOrder.product.map((product, pIndex) => (
                                        <React.Fragment key={pIndex}>
                                            <img src={product.image} alt={product.name} className="img-fluid rounded mr-3" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                            <div className="item-info">
                                                <h6>{product.name}</h6>
                                                <p>{product.treatment}</p>
                                                <p>Price: {productOrder.totalAmount} {productOrder.currency}</p>
                                                <p>Quantity: {productOrder.quantity}</p>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-danger mt-4">Track Your Order</button>

                    <div className="follower-boom"></div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
