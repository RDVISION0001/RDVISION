import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { useAuth } from '../auth/AuthContext';


function VerifiedSales() {
    const { roleName } = useAuth()
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

    const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;


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


    // API call to verify invoice
    const handleVerifyInvoice = async (invoiceId) => {
        try {
            const response = await axiosInstance.get(`/invoice/verifyInvoiceByAdmin/${invoiceId}`);
            toast.success(response.data.message || 'Invoice verified successfully!', { autoClose: 3000 });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify invoice', { autoClose: 3000 });
        }
    };

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
                                        {/* <th scope="col">Ser n.</th> */}
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Sale Date</th>
                                        <th scope="col">Closer Name</th>
                                        <th scope="col">Customer Name</th>
                                        <th scope="col">Customer Email</th>
                                        <th scope="col">Street</th>
                                        <th scope="col">City</th>
                                        <th scope="col">State</th>
                                        <th scope="col">Zip Code</th>
                                        <th scope="col">Country</th>
                                        <th scope="col" className='text-center'>Product Details  </th>
                                        <th scope="col">Doses</th>
                                        <th scope="col">Tracking Number</th>
                                        <th scope="col">Payment Windows</th>
                                        <th scope="col">Shipping Through</th>
                                        <th scope="col">Paid Amount</th>
                                        {roleName === 'admin' && <th scope="col">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.slice().reverse().map((invoice, index) => (
                                        <tr key={invoice.invoiceId} className='table-success'>
                                            {/* <td className="text-center">{index + 1}.</td> */}
                                            <td className='text-center'>{invoice.invoiceId || "N/A"}</td>
                                            <td>{formatDate(invoice.saleDate)}</td>
                                            <td> {invoice.closerName} </td>
                                            <td>{invoice.customerName}
                                                <button
                                                    type="button"
                                                    onClick={() => handleShowCustomerModal(invoice)} // Show customer details modal
                                                    className="btn btn-link p-0">....
                                                </button>
                                            </td>
                                            <td> {invoice.customerEmail} </td>
                                            <td className='text-center'>{invoice.address?.landmark || "N/A"}</td>
                                            <td className='text-center'>{invoice.address?.city || "N/A"}</td>
                                            <td className='text-center'>{invoice.address?.state || "N/A"}</td>
                                            <td className='text-center'>{invoice.address?.zipCode || "N/A"}</td>
                                            <td className='text-center'>
                                                <img src={getFlagUrl(invoice.countryIso)} alt="" /> {invoice.countryIso}
                                            </td>
                                            <td className='text-center'>
                                                <table className="table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "200px" }} className="px-4">Name</th>
                                                            <th style={{ width: "100px" }} className="px-3">Quantity</th>
                                                            <th style={{ width: "150px" }} className="px-3">Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {invoice.orderDto.productOrders.map((order, i) =>
                                                            order.product?.map((product, index) => (
                                                                <tr key={`${i}-${index}`} className="table table-bordered">
                                                                    <td>{product.name}</td>
                                                                    <td>{order.quantity || 'N/A'}</td>
                                                                    <td>{invoice.currency}{order.totalAmount || 'N/A'}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td className='text-center'>
                                                {invoice.orderDto?.productOrders[0]?.product[0]?.strength || "N/A"}
                                            </td>
                                            <td className='text-center'>{invoice.trackingNumber || "N/A"}</td>
                                            <td>{invoice.payment?.paymentWindow || 'N/A'}</td>
                                            <td><button>Add</button></td>
                                            <td className="text-success bold-text">
                                                {invoice.currency || 'USD'} {invoice.payment?.amount}
                                            </td>
                                            <td>
                                                {roleName === 'admin' && (
                                                    <Button
                                                        variant="success rounded"
                                                        onClick={() => handleVerifyInvoice(invoice.invoiceId)}
                                                    >
                                                        Next
                                                    </Button>
                                                )}
                                            </td>
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

