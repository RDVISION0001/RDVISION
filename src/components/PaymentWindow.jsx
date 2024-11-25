import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

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
            toast.success('Payment window added successfully!');
            setPaymentName('');
            fetchPaymentHistory();
        } catch (error) {
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
            setPaymentHistory([]);
        }
    };

    // Function to delete a specific payment window with SweetAlert2 confirmation
    const handleDelete = async (windowId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/paymentwindow/delete/${windowId}`);
                    toast.success("Payment window deleted successfully!");
                    fetchPaymentHistory();
                } catch (error) {
                    toast.error("Failed to delete payment window.");
                }
            }
        });
    };

    // Fetch payment history on component mount
    useEffect(() => {
        fetchPaymentHistory();
    }, []);



    return (
        <div className="container my-5">
            <div className="row">
                {/* Add Payment Window Form */}
                <div className="col-md-5">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">Add Payment Window</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-4">
                                    <label htmlFor="name" className="form-label">
                                        Payment Window Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter payment window name (e.g., Stripe, UPI)"
                                        value={paymentName}
                                        onChange={(e) => setPaymentName(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 btn-lg"
                                >
                                    Add Payment Window
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Existing Payment Windows Table */}
                <div className="col-md-7">
                    <div className="card shadow-lg">
                        <div className="card-header bg-info text-white text-center">
                            <h5 className="mb-0">Existing Payment Windows</h5>
                        </div>
                        <div className="card-body table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Payment Window Name</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentHistory.length > 0 ? (
                                        paymentHistory.map((payment, index) => (
                                            <tr key={payment.windowId}>
                                                <td>{index + 1}</td>
                                                <td>{payment.paymentWindowName}</td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-danger btn-sm me-2"
                                                        onClick={() => handleDelete(payment.windowId)}
                                                    >
                                                        🗑 Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default PaymentWindow;
