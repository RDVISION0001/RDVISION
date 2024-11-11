import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';  // Ensure toast is imported correctly if not already

function SalesReport() {
    const [invoices, setInvoices] = useState([]);
    const [view, setView] = useState(false); // For the Verify modal
    const [showCustomerModal, setShowCustomerModal] = useState(false); // For Customer Details modal
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // Store the selected invoice ID for verification

    const handleCloses = () => setView(false);
    const handleView = (invoiceId) => {
        setSelectedInvoiceId(invoiceId); // Store the selected invoice ID
        setView(true);
    };

    const handleCloseCustomerModal = () => setShowCustomerModal(false);
    const handleShowCustomerModal = (invoice) => {
        setSelectedCustomer({
            customerName: invoice.customerName,
            customerEmail: invoice.customerEmail,
            customerMobile: invoice.customerMobile,
            ticketId: invoice.orderDto?.ticketId || 'N/A',
        });
        setShowCustomerModal(true);
    };

    const handleVerify = () => {
        if (selectedInvoiceId) {
            // Send the invoiceId as part of the URL
            axiosInstance.get(`/invoice/setVerified/${selectedInvoiceId}`)
                .then((response) => {
                    toast.success("Verified successfully");
                    console.log('Invoice verified:', response.data);
                    setView(false); // Close the modal after verification
                })
                .catch((error) => {
                    console.error('Error verifying invoice:', error);
                    toast.error("Failed to verify the invoice"); // Optional error notification
                });
        }
    };

    useEffect(() => {
        axiosInstance.get('/invoice/verificationList')
            .then((response) => {
                setInvoices(response.data);
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    return (
        <>
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">Today Sales Report</h3>
                        <div className="bg-white mx-3">
                            <div className="followups-table table-responsive table-height">
                                <table className="table table-borderless table-hover">
                                    <thead className="text-dark" style={{ backgroundColor: 'gray' }}>
                                        <tr>
                                            <th scope="col">Closer Name</th>
                                            <th scope="col">Sale Date</th>
                                            <th scope="col">Customer Name</th>
                                            <th scope="col">Customer Order</th>
                                            <th scope="col">Invoice ID</th>
                                            <th scope="col">Ticket ID</th>
                                            <th scope="col">Issue Date</th>
                                            <th scope="col">Order Amount</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr className="border" key={invoice.invoiceId}>
                                                <td>
                                                    {invoice.customerName}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleShowCustomerModal(invoice)} // Show customer details modal
                                                        className="btn btn-link p-0">....
                                                    </button>
                                                </td>
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
                                                <td>{invoice.orderDto?.ticketId || 'N/A'}</td>
                                                <td>{formatDate(invoice.date)}</td>
                                                <td className="text-success bold-text">
                                                    {invoice.currency || 'USD'} {invoice.orderAmount}
                                                </td>
                                                <td>
                                                    <button type="button" onClick={() => handleView(invoice.invoiceId)} className="btn btn-success">Verify</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Details Modal */}
            <Modal show={showCustomerModal} onHide={handleCloseCustomerModal} centered>
                <div className="modal-header" style={{ backgroundColor: '#5f6368', color: '#fff', borderBottom: '2px solid #ccc' }}>
                    <h5 className="modal-title w-100 text-center" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                        Customer Details
                    </h5>
                    <button type="button" className="close" onClick={handleCloseCustomerModal} style={{ color: '#fff' }}>&times;</button>
                </div>
                <div className="modal-body" style={{ backgroundColor: '#f4f7fa', color: '#333' }}>
                    {selectedCustomer ? (
                        <div>
                            <p><strong>Name:</strong> <span className="text-muted">{selectedCustomer.customerName}</span></p>
                            <p><strong>Email:</strong> <span className="text-muted">{selectedCustomer.customerEmail}</span></p>
                            <p><strong>Mobile:</strong> <span className="text-muted">{selectedCustomer.customerMobile}</span></p>
                            <p><strong>Ticket ID:</strong> <span className="text-muted">{selectedCustomer.ticketId}</span></p>
                        </div>
                    ) : (
                        <p className="text-info">Loading customer details...</p>
                    )}
                </div>
                <div className="modal-footer justify-content-center" style={{ borderTop: '2px solid #ccc' }}>
                    <button className="btn btn-secondary" onClick={handleCloseCustomerModal} style={{ fontWeight: 'bold' }}>
                        Close
                    </button>
                </div>
            </Modal>

            {/* Verify Modal */}
            <Modal show={view} onHide={handleCloses} className="modal ticket-modal fade" tabIndex="-1" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="ticket-content-spacing">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="heading-area">
                                        <div className="vertical-write">
                                            <h2 className="title">{selectedCustomer?.customerName}</h2>
                                            <p className="ticket-id">
                                                <i className="fa-solid fa-ticket"></i> TKTID: {selectedCustomer?.ticketId}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="contact-info-row d-flex align-items-center justify-content-between">
                                        <a href={`tel:${selectedCustomer?.customerMobile}`} className="contact-info phone">
                                            <i className="fa-solid fa-phone"></i> {selectedCustomer?.customerMobile}
                                        </a>
                                        <a className="contact-info email" href={`mailto:${selectedCustomer?.customerEmail}`}>
                                            <i className="fa-solid fa-envelope-open-text"></i> {selectedCustomer?.customerEmail}
                                        </a>
                                    </div>
                                    <div className="main-content-area">
                                        <div className="modal-footer justify-content-center border-0">
                                            <Button variant="secondary" onClick={handleCloses}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleVerify} >
                                                Verify Invoice
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default SalesReport;
