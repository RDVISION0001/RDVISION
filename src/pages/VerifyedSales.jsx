import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Modal, Button } from "react-bootstrap";

function VerifiedSales() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

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

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.get('/invoice/getVerifiedInvoives');
                setInvoices(response.data);
            } catch (error) {
                setError(error.message || 'An error occurred while fetching invoices');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();

        return () => {
            setLoading(false);
        };
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const formatPaymentDate = (paymentDate) => {
        if (!paymentDate || !Array.isArray(paymentDate)) return 'N/A';
        const [year, month, day, hour, minute, second, millisecond] = paymentDate;
        return `${year}-${month + 1}-${day} ${hour}:${minute}:${second}`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h1>Verified Sales</h1>
                        {invoices.length === 0 ? (
                            <p>No verified invoices found</p>
                        ) : (
                            <div className="bg-white mx-3">
                                <div className="followups-table table-responsive table-height">
                                    <table className="table table-borderless table-hover">
                                        <thead className="text-dark" style={{ backgroundColor: 'gray' }}>
                                            <tr>
                                                <th scope="col">Closed By</th>
                                                <th scope="col">Sale Date</th>
                                                <th scope="col">Customer Name</th>
                                                <th scope="col">Customer Order</th>
                                                <th scope="col">Invoice ID</th>
                                                <th scope="col">Ticket ID</th>
                                                <th scope="col">Issue Date</th>
                                                <th scope="col">Total Payable Amount</th>
                                                <th scope="col">Payment Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((invoice) => (
                                                <tr className="border" key={invoice.invoiceId}>
                                                    <td>
                                                        {invoice.closerName}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleShowCustomerModal(invoice)}
                                                            className="btn btn-link p-0">....
                                                        </button>
                                                    </td>
                                                    <td>{formatDate(invoice.saleDate) || 'N/A'}</td> {/* Handle null saleDate */}
                                                    <td>{invoice.customerName}</td>
                                                    <td>
                                                        {invoice.orderDto?.productOrders?.length > 0 ? (
                                                            invoice.orderDto.productOrders.map(order =>
                                                                order.product?.map((p, index) => (
                                                                    <div key={index}>{p.name}</div>
                                                                ))
                                                            )
                                                        ) : (
                                                            'No Products Available'
                                                        )}
                                                    </td>
                                                    <td>{invoice.invoiceId || 'N/A'}</td> {/* Display invoiceId */}
                                                    <td>{invoice.orderDto?.ticketId || 'N/A'}</td>
                                                    <td>{formatDate(invoice.date)}</td> {/* Use issueDate or date */}
                                                    <td className="text-success bold-text">
                                                        {invoice.currency || 'USD'} {invoice.orderAmount}
                                                    </td>
                                                    <td className="text-success bold-text">{invoice.orderDto?.paymentStatus}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
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
        </>
    );
}

export default VerifiedSales;
