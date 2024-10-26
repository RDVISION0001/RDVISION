import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';

function Paid() {
    const [invoices, setInvoices] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [pendingTotalAmount, setPendingTotalAmount] = useState(0);
    const [paidCount, setPaidCount] = useState(0);
    const [paidTotalAmount, setPaidTotalAmount] = useState(0);

    useEffect(() => {
        // Fetch invoice data
        axiosInstance.get('/invoice/getinvoices') // Replace with your actual API endpoint
            .then((response) => {
                setInvoices(response.data);
                calculateInvoiceStats(response.data);
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    const calculateInvoiceStats = (invoices) => {
        // Calculate pending invoice count and total amount
        const pendingInvoices = invoices.filter(invoice => invoice.inviceStatus === 'Pending');
        setPendingCount(pendingInvoices.length);
        const pendingTotal = pendingInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
        setPendingTotalAmount(pendingTotal);

        // Calculate paid invoice count and total amount
        const paidInvoices = invoices.filter(invoice => invoice.inviceStatus === 'Paid');
        setPaidCount(paidInvoices.length);
        const totalAmount = paidInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
        setPaidTotalAmount(totalAmount);

    };

    return (
        <>
            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card shadow p-3 mb-5">
                                <div className="card-body">
                                    <h4 className="card-title">Pending Invoices</h4>
                                    <h5 className="text-success bold-text">{pendingCount}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow p-3 mb-5">
                                <div className="card-body">
                                    <h4 className="card-title">Total Amount of Pending Invoices</h4>
                                    <h5 className="text-success bold-text">{invoices.length > 0 ? invoices[0].currency : ''} : {pendingTotalAmount.toFixed(2)}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow p-3 mb-5">
                                <div className="card-body">
                                    <h4 className="card-title">Paid Invoices</h4>
                                    <h5 className="text-success bold-text">{paidCount}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow p-3 mb-5">
                                <div className="card-body">
                                    <h4 className="card-title">Total Amount of Paid Invoices</h4>
                                    <h5 className="text-success bold-text">{invoices.length > 0 ? invoices[0].currency : ''} : {paidTotalAmount.toFixed(2)}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="followup-table-section py-3">
                <div className="container-fluid">
                    <div className="table-wrapper tabbed-table">
                        <h3 className="title">Invoice Table</h3>
                        <div className="bg-white mx-3">
                            <div className="followups-table table-responsive table-height">
                                <table className="table table-borderless table-hover">
                                    <thead className="text-dark" style={{ backgroundColor: 'gray' }}>
                                        <tr>
                                            <th scope="col" className="text-center">
                                                <input type="checkbox" />
                                            </th>
                                            <th scope="col">Invoice ID</th>
                                            <th scope="col">Ticket ID</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Issue Date</th>
                                            <th scope="col">Delivery Status</th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice) => (
                                            <tr className="border" key={invoice.inviceId}>
                                                <td className="text-center">
                                                    <input type="checkbox" />
                                                </td>
                                                <td>{invoice.inviceId}</td>
                                                <td>{invoice.ticketId}</td>
                                                <td>{invoice.inviceStatus}</td>
                                                <td>{invoice.createDate ? invoice.createDate.join('-') : 'N/A'}</td>
                                                <td>{invoice.deliveryStatus || 'N/A'}</td>
                                                <td className="text-success bold-text">
                                                    {invoice.currency} {invoice.totalAmount ? invoice.totalAmount.toFixed(2) : '0.00'}
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
        </>
    );
}

export default Paid;
