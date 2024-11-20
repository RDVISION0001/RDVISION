import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosInstance';
import { useAuth } from "../auth/AuthContext";

function InvoiceNewTemp() {
    const [invoices, setInvoices] = useState([]); // State to store invoice data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const {userId} = useAuth();

    // Format date to 15Nov_2024
    const formatDate = (date) => {
        if (!date) return "N/A";
        const options = { day: "2-digit", month: "short", year: "numeric" };
        const formattedDate = new Date(date).toLocaleDateString("en-US", options).replace(/ /g, "");
        return formattedDate.replace(",", "_");
    };

    // Fetch invoices
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.get(`/invoice/getInvoiceByUser/${userId}`); // Replace with your actual API endpoint
                setInvoices(response.data); // Assuming response.data is an array of invoices
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch invoices. Please try again.");
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [userId]);

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
            {/* card */}
            <section className="sadmin-top-section mt-3">
                <div className="container-fluid">
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
                                                fontSize: "3rem",  // Increased icon size
                                                marginRight: "10px",
                                                color: "#4CAF50", // Smooth green color for icon
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5 className="card-title">Total Paid Amount</h5>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPaidAmount.toFixed(2)} USD`}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                            className="fas fa-file-invoice-dollar"
                                            style={{
                                                fontSize: "3rem",  
                                                marginRight: "10px",
                                                color: "#FF9800", 
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5 className="card-title">Total Paid Invoices</h5>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : totalPaidInvoices}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Total Pending Amount */}
                        <div className="col-12 col-md-3 mb-3">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#FFE5B4",
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
                                                color: "#FFC107", 
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5 className="card-title">Total Pending Amount</h5>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPendingAmount.toFixed(2)} USD`}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Total Pending Invoices */}
                        <div className="col-12 col-md-3 mb-3">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#FFCDD2",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <div className="card-body d-flex align-items-center justify-content-center">
                                    <div>
                                        <i
                                            className="fas fa-hourglass-half"
                                            style={{
                                                fontSize: "3rem",  
                                                marginRight: "10px",
                                                color: "#F44336", 
                                            }}
                                        ></i>
                                    </div>
                                    <div>
                                        <h5 className="card-title">Total Pending Invoices</h5>
                                        <h5 className="font-weight-bold">
                                            {loading ? "Loading..." : totalPendingInvoices}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* table */}
            <section className="followup-table-section py-4 d-flex">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h5 className="title">Live Tickets<span className="d-flex justify-content-end"></span></h5>
                        {loading ? (
                            <p>Loading invoices...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
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
        </>
    );
}

export default InvoiceNewTemp;
