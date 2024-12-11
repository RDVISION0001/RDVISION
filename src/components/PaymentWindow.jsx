import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function PaymentWindow() {
    const [paymentName, setPaymentName] = useState('');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [careerName, setCareerName] = useState('');
    const [careerList, setCareerList] = useState([]);

    // Function to handle form submission and make the POST request for Payment Window
    const handleSubmitPayment = async (e) => {
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
    const handleDeletePayment = async (windowId) => {
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

    // Function to handle form submission and make the POST request for Career
    const handleSubmitCareer = async (e) => {
        e.preventDefault();
        if (!careerName.trim()) {
            toast.warning("Please enter a valid career name.");
            return;
        }
        try {
            const payload = { careerName: careerName };
            const response = await axiosInstance.post('/career/add', payload);
            toast.success('Career added successfully!');
            setCareerName('');
            fetchCareerList();
        } catch (error) {
            toast.error("Failed to add career.");
        }
    };

    // Function to fetch all careers and update the table
    const fetchCareerList = async () => {
        try {
            const response = await axiosInstance.get('/career/gelAll');
            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            setCareerList(data);
        } catch (error) {
            setCareerList([]);
        }
    };

    // Function to delete a specific career with SweetAlert2 confirmation
    const handleDeleteCareer = async (careerId) => {
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
                    await axiosInstance.delete(`/career/delete/${careerId}`);
                    toast.success("Career deleted successfully!");
                    fetchCareerList();
                } catch (error) {
                    toast.error("Failed to delete career.");
                }
            }
        });
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchPaymentHistory();
        fetchCareerList();
    }, []);

    return (
        <>
            <section className="followup-table-section">
                <div className="container-fluid">
                    <div className="container">
                        <div className="row">
                            {/* Add Payment Window Form */}
                            <div className="col-md-5">
                                <div className="card">
                                    <div className="card-header bg-primary text-white text-center">
                                        <h5 className="mb-0">Add Payment Window</h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmitPayment}>
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
                                <div className="card">
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
                                                                    onClick={() => handleDeletePayment(payment.windowId)}
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
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </section >

            <section className="followup-table-section mt-4">
                <div className="container-fluid">
                    <div className="container">
                        <div className="row">
                            {/* Add Career Form */}
                            <div className="col-md-5">
                                <div className="card">
                                    <div className="card-header bg-primary text-white text-center">
                                        <h5 className="mb-0">Add Career</h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmitCareer}>
                                            <div className="form-group mb-4">
                                                <label htmlFor="careerName" className="form-label">
                                                    Career Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="careerName"
                                                    placeholder="Enter career name (e.g., India Post)"
                                                    value={careerName}
                                                    onChange={(e) => setCareerName(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 btn-lg"
                                            >
                                                Add Career
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* Existing Career Table */}
                            <div className="col-md-7">
                                <div className="card">
                                    <div className="card-header bg-info text-white text-center">
                                        <h5 className="mb-0">Existing Careers</h5>
                                    </div>
                                    <div className="card-body table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Career Name</th>
                                                    <th className="text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {careerList.length > 0 ? (
                                                    careerList.map((career, index) => (
                                                        <tr key={career._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{career.careerName}</td>
                                                            <td className="text-center">
                                                                <button
                                                                    className="btn btn-danger btn-sm me-2"
                                                                    onClick={() => handleDeleteCareer(career.careerId)}
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
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}

export default PaymentWindow;
