import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import Paysuccess from '../assets/notification/Paysuccess.mp3';

const PaymentSuccess = ({ orderDetails }) => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Play sound when component mounts
        const audio = new Audio(Paysuccess);
        audio.play().catch((error) => {
            console.error("Failed to play sound:", error);
        });

        // Trigger confetti
        setShowConfetti(true);

        // Trigger follower boom effect
        const followerBoom = document.querySelector('.follower-boom');
        if (followerBoom) {
            followerBoom.classList.add('show');
            setTimeout(() => {
                followerBoom.classList.remove('show');
                setShowConfetti(false); // Stop confetti after 5 seconds
            }, 9000); // Effect lasts for 5 seconds
        }
    }, []);

    return (
        <div className="order-confirmation-container container mt-5">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="row">
                {/* Left Side: Thank You Message and Billing Info */}
                <div className="col-md-6 left-side p-4">
                    <h2 className="thank-you">Thank you for your purchase!</h2>
                    <p>Your order will be processed within 24 hours during working hours. We will notify you once your items have been shipped.</p>

                    <h4 className="mt-4">Billing Address:</h4>
                    <ul className="list-unstyled">
                        <li><strong>Name:</strong> John Smith</li>
                        <li><strong>Address:</strong> 123 Main St, San Francisco, CA</li>
                        <li><strong>Phone:</strong> +1234567890</li>
                        <li><strong>Email:</strong> john.smith@example.com</li>
                    </ul>

                    <button className="btn btn-danger mt-4">Track Your Order</button>
                </div>

                {/* Right Side: Order Summary */}
                <div className="col-md-6 right-side p-4">
                    <div className="order-summary bg-light p-4 rounded">
                        <h4 className="mb-3">Order Summary</h4>

                        <div className="order-item d-flex justify-content-between align-items-center mb-3">
                            <div className="item-details">
                                <img src="https://via.placeholder.com/50" alt="Product 1" className="img-fluid rounded mr-3" />
                                <div className="item-info">
                                    <h6>All the Chocolates Combo</h6>
                                    <p>$60.00</p>
                                </div>
                            </div>
                        </div>

                        <div className="order-item d-flex justify-content-between align-items-center mb-3">
                            <div className="item-details">
                                <img src="https://via.placeholder.com/50" alt="Product 2" className="img-fluid rounded mr-3" />
                                <div className="item-info">
                                    <h6>Snack Box Treats</h6>
                                    <p>$25.00</p>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="order-total d-flex justify-content-between">
                            <h6>Total:</h6>
                            <p>$85.00</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Follower Boom Effect */}
            <div className="follower-boom"></div>
        </div>
    );
};

export default PaymentSuccess;
