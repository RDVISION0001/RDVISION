import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';


const PaymentFailed = () => {
  const stripePromise = loadStripe("pk_live_51KpHlnSAxOboMMomzgtOknKDOwEg9AysCqs6g0O2e9ETloartosrHcf8qOAwOsChi8s5EYN8UHzNn2VgyKirIE6K00TujZ91YB");
  const handleRetry = () => {
    // Add your retry logic here
    console.log('Retry button clicked');
  };
  const orderid = useParams()
  console.log(orderid)
  const [isLive, setIslive] = useState(true)
  useEffect(() => {
    document.getElementById("filed").classList.add("fa-bounce")
    setTimeout(() => {
      document.getElementById("filed").classList.remove("fa-bounce")

    }, 1000);
  }, [])
  const handlePay = async () => {
    console.log("Handling Paymnet")
    try {
      const stripe = await stripePromise;

      const response = await fetch(`https://rdvision.online/invoice/create-checkout-session/${orderid.orderid
        }`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isLive: isLive
        }) // Convert to cents
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



  return (
    <div className="overlay">
      <div className="order-failed-card">
        <div className="card-header">
          <button className="close-button" onClick={() => console.log('Close')}>X</button>
        </div>
        <div className="card-body">
          <div className="icon">
            {/* Replace this with an appropriate icon */}
            <span role="img" aria-label="plug"><i id='filed' className="fa-solid fa-circle-exclamation fa-bounce fa-2xl" style={{ color: "#ed121d" }}></i></span>
          </div>
          <h2 className="error-title">Payment Failed!</h2>
          <p className="error-message">
            We couldn't complete your order request. <br />
            <strong>Network was unreachable</strong>
          </p>
          <button className="retry-button" onClick={handlePay}>Retry Payment</button>
        </div>
      </div>
    </div>
  );
};


export default PaymentFailed