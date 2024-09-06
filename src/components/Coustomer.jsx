import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import html2pdf from 'html2pdf.js';

const Customer = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ticketId = '2833092896'; // Replace this with the actual ticket ID you want to use

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/order/getOrderDetails/${ticketId}`);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [ticketId]);

  const handleGeneratePDF = () => {
    const element = document.getElementById('invoice');

    const options = {
      margin: 2,
      filename: 'rDVision.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 10 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(element)
      .set(options)
      .save();
  };

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const { addresss, productOrders, ticketDetail } = orderDetails || {};

  // Calculate total amount from productOrders if available
  const totalAmount = productOrders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  return (
    <div className="container my-4">
      <div className="bg-white p-4 border" style={{ position: 'relative' }}>
        <div id="invoice" style={{ position: 'relative', zIndex: 1 }}>
          {/* Company Details */}
          <div className='invoice'>
            <div className="text-center mb-4">
              <h1 className="h4 mb-1">Your Company Name</h1>
              <p className="mb-1">123 Company Address, City, Country</p>
              <p>Phone: +123 456 7890 | Email: info@company.com</p>
            </div>

            {/* Invoice and Customer Details */}
            <div className="mb-4">
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Ticket Id:</strong> {ticketId}</p>
                  <p><strong>Invoice Number:</strong> {orderDetails?.invoiceNumber || 'N/A'}</p>
                  <p><strong>Invoice Date:</strong> {ticketDetail?.queryTime}</p>
                  <p><strong>Due Date:</strong> {orderDetails?.dueDate || 'N/A'}</p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p><strong>Billed To:</strong></p>
                  <p>{addresss?.houseNumber}, {addresss?.landmark}, {addresss?.city}</p>
                  <p>{addresss?.state}, {addresss?.country}, {addresss?.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-4">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Packaging Size</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {productOrders.map((order) => {
                    const product = productMap[order.productId];
                    return (
                      <tr key={order.productorderId}>
                        <td>{order.productId}</td>
                        <td>{product ? product.name : 'Unknown'}</td>
                        <td>{product ? product.brand : 'Unknown'}</td>
                        <td>{order.quantity}</td>
                        <td>{order.totalAmount}</td>
                      </tr>
                    );
                  })}
                </tbody> */}
              </table>
            </div>

            {/* Total Amount */}
            <div className="text-right mb-4">
              <p className="h5">
                <strong>Total Amount: ${totalAmount.toFixed(2) || '0.00'}</strong>
              </p>
            </div>

          </div>

          {/* View Order Button */}
          <div className="text-center mb-4">
            <button onClick={handleGeneratePDF} className="btn btn-primary">
              Download PDF
            </button>
            <button className="btn btn-success m-3">Agree</button>
            <button className="btn btn-danger m-3">Disagree</button>
          </div>

          {/* Footer */}
          <div className="text-center text-muted" style={{ fontSize: '12px' }}>
            <p>&copy; 2024 Your Company Name. All Rights Reserved.</p>
          </div>
        </div>

        {/* Background Logo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/path/to/your-logo.png)', // Replace with the path to your logo
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          opacity: 0.1 // Adjust opacity to make it a background
        }} />
      </div>
    </div>
  );
};

export default Customer;
