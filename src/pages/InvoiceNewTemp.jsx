import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosInstance';
import { useAuth } from "../auth/AuthContext";
// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function InvoiceNewTemp() {
    const [invoices, setInvoices] = useState([]); // State to store invoice data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const { userId } = useAuth();



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null); // State to store selected invoice
    const [formData, setFormData] = useState({
        transectionid: "",
        amount: "",
        currency: "USD", // Default currency
        paymentWindow: "",
        userId,
        uniqueQueryId: "", // Added uniqueQueryId to the formData
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/invoice/processPayment", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Response:", response.data);
            toast.success("Payment processed successfully!");
        } catch (error) {
            console.error("Error:", error.response || error);
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsModalOpen(false);
        }
    };

    // Fetch invoices
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.get(`/invoice/getInvoiceByUser/${userId}`);
                setInvoices(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch invoices. Please try again.");
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [userId]);


    // Format date to 15Nov_2024
    const formatDate = (date) => {
        if (!date) return "N/A";
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Date(date).toLocaleDateString("en-US", options).replace(/ /g, "");
        return formattedDate.replace(",", "_");
    };

    // Handle Mark Paid button click
    const handleMarkAsPaidClick = (invoice) => {
        setSelectedInvoice(invoice); // Set selected invoice
        setFormData({ ...formData, uniqueQueryId: invoice.uniqueQueryId }); // Set uniqueQueryId in the form
        setIsModalOpen(true); // Open modal
    };


    // Calculations for cards
    const totalPaidAmount = invoices
        .filter(invoice => invoice.paymentStatus === "paid")
        .reduce((sum, invoice) => sum + (invoice.orderAmount || 0), 0);

    const totalPaidInvoices = invoices.filter(invoice => invoice.paymentStatus === "paid").length;

    const totalPendingAmount = invoices
        .filter(invoice => invoice.paymentStatus !== "paid")
        .reduce((sum, invoice) => sum + (invoice.orderAmount || 0), 0);

    const totalPendingInvoices = invoices.filter(invoice => invoice.paymentStatus !== "paid").length;

    return (
        <>
            {/* card section (unchanged) */}
            <section className="sadmin-top-section mt-3">
                <div className="container-fluid">

                    <div className="row justify-content-center">
                        {/* Total Paid Amount Card */}
                        <div className="col-md-3 col-sm-6 col-12">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "100%", // Make the card full width on small screens

                    <div className="row">
                        {/* Total Paid Amount */}
                        <div className="col-12 col-md-3 mb-3">
                            <div
                                className="card border shadow text-dark"
                                style={{

                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#A8E6CF",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <div className="card-body d-flex align-items-center justify-content-center">
                                    <div>
                                        <i
                                            className="fas fa-dollar-sign"
                                            style={{
                                                fontSize: "3rem",
                                                marginRight: "10px",
                                                color: "#4CAF50",
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <p className="card-title fw-bold">Total Paid Amount</p>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPaidAmount.toFixed(2)} USD`}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Total Paid Invoices Card */}
                        <div className="col-md-3 col-sm-6 col-12">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "100%", // Ensure card takes full width on smaller screens
                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#FFCDD2",

                        {/* Total Paid Invoices */}
                        <div className="col-12 col-md-3 mb-3">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#FFD3B6",

                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <div className="card-body d-flex align-items-center justify-content-center">
                                    <div>
                                        <i
                                            className="fas fa-check-circle"
                                            style={{
                                                fontSize: "3rem",
                                                marginRight: "10px",
                                                color: "#FF5722",
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <p className="card-title fw-bold">Total Paid Invoices</p>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPaidInvoices}`}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Total Pending Amount Card */}
                        <div className="col-md-3 col-sm-6 col-12">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "100%", // Make the card full width on smaller screens

                        {/* Total Pending Amount */}
                        <div className="col-12 col-md-3 mb-3">
                            <div
                                className="card border shadow text-dark"
                                style={{

                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#FFEB3B",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <div className="card-body d-flex align-items-center justify-content-center">
                                    <div>
                                        <i
                                            className="fas fa-clock"
                                            style={{
                                                fontSize: "3rem",
                                                marginRight: "10px",
                                                color: "#FF9800",
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <p className="card-title fw-bold">Total Pending Amount</p>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPendingAmount.toFixed(2)} USD`}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Total Pending Invoices Card */}
                        <div className="col-md-3 col-sm-6 col-12">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "100%", // Ensure card takes full width on smaller screens

                        {/* Total Pending Invoices */}
                        <div className="col-12 col-md-3 mb-3">
                            <div
                                className="card border shadow text-dark"
                                style={{

                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#D1C4E9",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <div className="card-body d-flex align-items-center justify-content-center">
                                    <div>
                                        <i
                                            className="fas fa-exclamation-circle"
                                            style={{
                                                fontSize: "3rem",
                                                marginRight: "10px",
                                                color: "#9C27B0",
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <p className="card-title fw-bold">Total Pending Invoices</p>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPendingInvoices}`}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="followup-table-section py-4 d-flex">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h5 className="title">Live Tickets</h5>
                        {loading ? (
                            <p>Loading invoices...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="selection-cell-header" data-row-selection="true">
                                            <input type="checkbox" />
                                        </th>
                                        <th scope="col">Closer Name</th>
                                        <th scope="col">Sale Date</th>
                                        <th scope="col">Customer Name</th>
                                        <th scope="col">Customer Order</th>
                                        <th scope="col">Invoice Generate Date</th>
                                        <th scope="col">Order Amount</th>
                                        <th scope="col">Payment Status</th>
                                        <th scope="col">Seen</th>
                                        <th scope="col">IP Address</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr className="border" key={invoice.invoiceId}>
                                            <td><input type="checkbox" /></td>
                                            <td>{invoice.closerName}</td>
                                            <td>{formatDate(invoice.saleDate)}</td>
                                            <td>{invoice.customerName}</td>
                                            <td>
                                                {invoice.orderDto?.productOrders?.map(order =>
                                                    order.product?.map((p, index) => (
                                                        <div key={index}>{p.name}</div>
                                                    ))
                                                )}
                                                {(!invoice.orderDto?.productOrders || invoice.orderDto.productOrders.length === 0) && 'No Products Available'}
                                            </td>
                                            <td>{formatDate(invoice.invoiceGenerateDate)}</td>
                                            <td className="text-success bold-text">
                                                {invoice.currency || 'USD'} {invoice.orderAmount}
                                            </td>
                                            <td className={invoice.paymentStatus === "paid" ? "text-success" : "text-danger"}>
                                                {invoice.paymentStatus || "Pending"}
                                            </td>
                                            <td className={invoice.opened === "paid" ? "text-success fw-bold" : "text-danger"}>
                                                {invoice.opened ? <i className="fa-solid fa-check fa-2xl" style={{ color: "#067f30" }}></i> : <i className="fa-solid fa-xmark fa-xl" style={{ color: "#ff0000" }}></i>}
                                            </td>
                                            <td className={invoice.opened === "paid" ? "text-success fw-bold" : "text-danger"}>
                                                {invoice.ipAddress ? invoice.ipAddress : "not opened yet"}
                                            </td>
                                            <td>
                                                {invoice.paymentStatus !== "paid" && (
                                                    <button className="btn btn-success rounded" onClick={() => handleMarkAsPaidClick(invoice)}>
                                                        Mark paid
                                                    </button>
                                                )}
                                            </td>

                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Closer Name</th>
                                            <th scope="col">Sale Date</th>
                                            <th scope="col">Customer Name</th>
                                            <th scope="col">Customer Order</th>
                                            <th scope="col">Invoice Generate Date</th>
                                            <th scope="col">Order Amount</th>
                                            <th scope="col">Payment Status</th>
                                            <th scope="col">Payment Attempt</th>
                                            <th scope="col">Seen</th>
                                            <th scope="col">IP Address</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr className="border" key={invoice.invoiceId}>
                                                <td>{invoice.closerName}</td>
                                                <td>{formatDate(invoice.saleDate)}</td>
                                                <td>{invoice.customerName}</td>
                                                <td>
                                                    {invoice.orderDto?.productOrders?.map(order =>
                                                        order.product?.map((p, index) => (
                                                            <div key={index}>{p.name}</div>
                                                        ))
                                                    )}
                                                    {(!invoice.orderDto?.productOrders || invoice.orderDto.productOrders.length === 0) && 'No Products Available'}
                                                </td>
                                                <td>{formatDate(invoice.invoiceGenerateDate)}</td>
                                                <td className="text-success bold-text">
                                                    {invoice.currency || 'USD'} {invoice.orderAmount}
                                                </td>
                                                <td className={invoice.paymentStatus === "paid" ? "text-success" : "text-danger"}>
                                                    {invoice.paymentStatus || "Pending"}
                                                </td>
                                                <td className={invoice.paymentStatus === "paid" ? "text-success text-center" : "text-danger text-center"}>
                                                    {invoice.numberOfPaymentAttempt || 0}
                                                </td>
                                                <td className={invoice.isSeen ? "text-success" : "text-danger"}> 
                                                    {invoice.isSeen ? "Seen" : "Not Seen"}
                                                </td>
                                                <td>{invoice.ipAddress || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* mark as paid Modal */}
            {isModalOpen && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    id="addTicketModal"
                    tabIndex="-1"
                    aria-labelledby="addTicketModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addTicketModalLabel">
                                    Mark as Paid
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="transectionid">Transaction ID</label>
                                        <input
                                            type="text"
                                            id="transectionid"
                                            className="form-control"
                                            name="transectionid"
                                            value={formData.transectionid}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amount">Amount</label>
                                        <input
                                            type="text"
                                            id="amount"
                                            className="form-control"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="paymentWindow">Payment Window</label>
                                        <input
                                            type="text"
                                            id="paymentWindow"
                                            className="form-control"
                                            name="paymentWindow"
                                            value={formData.paymentWindow}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="paymentWindow">Currency</label>
                                        <select
                                            id="paymentWindow"
                                            className="form-control"
                                            name="paymentWindow"
                                            value={formData.currency}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Currency</option>
                                            <option value="INR">INR - Indian Rupee</option>
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="AUD">AUD - Australian Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="JPY">JPY - Japanese Yen</option>
                                        </select>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Mark as Paid
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

export default InvoiceNewTemp;

