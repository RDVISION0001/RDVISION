import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosInstance';

function InvoiceNewTemp() {
    const [invoices, setInvoices] = useState([]); // State to store invoice data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

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
                const response = await axiosInstance.get("/invoice/verificationList"); // Replace with your actual API endpoint
                setInvoices(response.data); // Assuming response.data is an array of invoices
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch invoices. Please try again.");
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

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
            <section className="sadmin-top-section">
                <div className="container-fluid">
                    <div className="row">
                        {/* Total Paid Amount */}
                        <div className="col-md-3 rponded">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "18rem",
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
                                        <h3 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPaidAmount.toFixed(2)} USD`}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Total Paid Invoices */}
                        <div className="col-md-3 rponded">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "18rem",
                                    height: "100px",
                                    borderRadius: "10px",
                                    backgroundColor: "#FFD3B6",
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
                                        <h3 className="font-weight-bold">
                                            {loading ? "Loading..." : totalPaidInvoices}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Total Pending Amount */}
                        <div className="col-md-3 rponded">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "18rem",
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
                                        <h3 className="font-weight-bold">
                                            {loading ? "Loading..." : `${totalPendingAmount.toFixed(2)} USD`}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Total Pending Invoices */}
                        <div className="col-md-3 rponded">
                            <div
                                className="card border shadow text-dark"
                                style={{
                                    width: "18rem",
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
                                        <h3 className="font-weight-bold">
                                            {loading ? "Loading..." : totalPendingInvoices}
                                        </h3>
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
                        <h3 className="title">Live Tickets<span className="d-flex justify-content-end"></span></h3>
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
                                        <th scope="col">Invoice ID</th>
                                        <th scope="col">Invoice Generate Date</th>
                                        <th scope="col">Order Amount</th>
                                        <th scope="col">Payment Status</th>
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
                                            <td>{invoice.invoiceId}</td>
                                            <td>{formatDate(invoice.invoiceGenerateDate)}</td>
                                            <td className="text-success bold-text">
                                                {invoice.currency || 'USD'} {invoice.orderAmount}
                                            </td>
                                            <td className= {invoice.paymentStatus === "paid" ? "text-success" : "text-danger"}>
                                                {invoice.paymentStatus || "Pending"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default InvoiceNewTemp;
