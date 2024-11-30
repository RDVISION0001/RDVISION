import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Modal, Button } from "react-bootstrap";

function VerifiedSales() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [filter, setFilter] = useState('all'); // Default to "all"

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

    // Fetch invoices
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
    }, []);

    // Filter invoices based on verificationDate
    const getFilteredInvoices = () => {
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(todayStart.getDate() + 1);
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(todayStart.getDate() - 1);
        const dayBeforeYesterdayStart = new Date(todayStart);
        dayBeforeYesterdayStart.setDate(todayStart.getDate() - 2);

        switch (filter) {
            case 'today':
                return invoices.filter(invoice => {
                    const verificationDate = new Date(invoice.verificationDate);
                    return verificationDate >= todayStart && verificationDate < tomorrowStart;
                });
            case 'yesterday':
                return invoices.filter(invoice => {
                    const verificationDate = new Date(invoice.verificationDate);
                    return verificationDate >= yesterdayStart && verificationDate < todayStart;
                });
            case 'parsho': // Day before yesterday
                return invoices.filter(invoice => {
                    const verificationDate = new Date(invoice.verificationDate);
                    return verificationDate >= dayBeforeYesterdayStart && verificationDate < yesterdayStart;
                });
            case 'all':
            default:
                return invoices;
        }
    };

    const filteredInvoices = getFilteredInvoices();

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
                        <h3 className="title mb-4">Verified Sales</h3>

                        {/* Filter Buttons */}
                        <div className="mb-3 d-flex justify-content-start gap-3">
                            <Button
                                variant={filter === 'today' ? 'primary' : 'outline-primary'}
                                onClick={() => setFilter('today')}
                                className="btn-lg"
                            >
                                Today
                            </Button>
                            <Button
                                variant={filter === 'yesterday' ? 'primary' : 'outline-primary'}
                                onClick={() => setFilter('yesterday')}
                                className="btn-lg"
                            >
                                Yesterday
                            </Button>
                            <Button
                                variant={filter === 'parsho' ? 'primary' : 'outline-primary'}
                                onClick={() => setFilter('parsho')}
                                className="btn-lg"
                            >
                                Day Before Yesterday
                            </Button>
                            <Button
                                variant={filter === 'all' ? 'primary' : 'outline-primary'}
                                onClick={() => setFilter('all')}
                                className="btn-lg"
                            >
                                All
                            </Button>
                        </div>

                        {/* Invoice Table */}
                        <div className="followups-table table-responsive table-height">
                            <table className="table table-bordered table-hover table-striped table-sm">
                                <thead className="text-white" style={{ backgroundColor: '#343a40' }}>
                                    <tr>
                                        <th scope="col">S No</th>
                                        <th scope="col">Order No</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Varification Date </th>
                                        <th scope="col">Closed By</th>
                                        <th scope="col">Order Status</th>
                                        <th scope="col">Customer Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Order</th>
                                        <th scope="col">Tracking No</th>
                                        <th scope="col">Payment Window</th>
                                        <th scope="col">Received Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.map((invoice, index) => (
                                        <tr key={invoice.invoiceId} className='table-success'>
                                            <td className="text-center">{index + 1}.</td>
                                            <td>{invoice.orderDto?.orderId}</td>
                                            <td className="text-nowrap">{formatDate(invoice.saleDate) || 'N/A'}</td>
                                            <td className="text-nowrap">{formatDate(invoice.verificationDate) || 'N/A'}</td>
                                            <td className="text-nowrap"> {invoice.closerName} </td>
                                            <td>{invoice.deliveryStatus || 'Processing'}</td>
                                            <td>{invoice.customerName}  <button
                                                type="button"
                                                onClick={() => handleShowCustomerModal(invoice)}
                                                className="btn btn-link p-0"
                                            >
                                                ...
                                            </button></td>
                                            <td>{invoice.customerEmail}</td>
                                            <td>{invoice.address?.landmark},{invoice.address?.houseNumber},{invoice.address?.city},{invoice.address?.state},{invoice.address?.country},{invoice.address?.zipCode}</td>
                                            <td>
                                                {invoice.orderDto?.productOrders?.length > 0 ? (
                                                    invoice.orderDto.productOrders.map((order, i) =>
                                                        order.product?.map((p, index) => (
                                                            <div key={`${i}-${index}`}>{p.name}</div>
                                                        ))
                                                    )
                                                ) : (
                                                    'No Products Available'
                                                )}
                                            </td>
                                            <td>{invoice.trackingNumber || 'Waiting'}</td>
                                            <td>{invoice.payment?.paymentWindow}</td>
                                            <td className="text-success font-weight-bold">{invoice.payment?.currency} {invoice.payment?.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
        </>
    );
}

const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).replace(',', ''); // Removes the comma if it appears
};

export default VerifiedSales;
