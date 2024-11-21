import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PaymentWindow() {
    const [paymentName, setPaymentName] = useState('');
    const [paymentHistory, setPaymentHistory] = useState([]);

    // Function to handle form submission and make the POST request
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!paymentName.trim()) {
            toast.warning("Please enter a valid payment window name.");
            return;
        }
        try {
            const payload = { paymentWindowName: paymentName };
            const response = await axiosInstance.post('/paymentwindow/add', payload);
            console.log(response.data);
            toast.success('Tickets assigned successfully!');
            setPaymentName('');
            fetchPaymentHistory();
        } catch (error) {
            console.error("Error adding payment window:", error);
            toast.error("Failed to add payment window.");
        }
    };

    // Function to fetch all payment windows and update the table
    const fetchPaymentHistory = async () => {
        try {
            const response = await axiosInstance.get('/paymentwindow/getAll');
            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            setPaymentHistory(data);
        } catch (error) {
            console.error("Error fetching payment history:", error);
            setPaymentHistory([]); // Set to empty array on error
        }
    };

    // Fetch payment history on component mount
    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    return (
        <div className="container mt-3">
            <div className="card shadow">
                <div className="card-body">
                    <h4 className="text-center">Payment Window</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Please enter a name of payment window</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter payment window name (e.g., Stripe, UPI)"
                                value={paymentName}
                                onChange={(e) => setPaymentName(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Add Payment Window
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-5">
                <h4 className="text-center mb-3">Existing Payment Window</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-primary">
                            <tr>
                                <th>S. n.</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.length > 0 ? (
                                paymentHistory.map((payment, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}.</td>
                                        <td>{payment.paymentWindowName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PaymentWindow;
