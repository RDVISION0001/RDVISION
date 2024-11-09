import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { Modal, Button } from "react-bootstrap";

function Paid() {
    const [invoices, setInvoices] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [pendingTotalAmount, setPendingTotalAmount] = useState(0);
    const [paidCount, setPaidCount] = useState(0);
    const [paidTotalAmount, setPaidTotalAmount] = useState(0);
    const [view, setView] = useState(false);

    const handleCloses = () => setView(false);
    const handleView = () => setView(true);

    useEffect(() => {
        axiosInstance.get('/invoice/getinvoices')
            .then((response) => {
                setInvoices(response.data);
                calculateInvoiceStats(response.data);
            })
            .catch((error) => {
                console.error('Error fetching invoices:', error);
            });
    }, []);

    const calculateInvoiceStats = (invoices) => {
        const pendingInvoices = invoices.filter(invoice => invoice.inviceStatus === 'Pending');
        setPendingCount(pendingInvoices.length);
        const pendingTotal = pendingInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
        setPendingTotalAmount(pendingTotal);

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
                                            <th scope="col">Verify</th>
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
                                                <td>
                                                    <button type="button" onClick={handleView} className="btn btn-success">Verify</button>
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

            {/* Modal verify */}
            <Modal
                show={view} onHide={handleCloses}
                className="modal ticket-modal fade"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="ticket-content-spacing">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="heading-area">
                                        <div className="vertical-write">
                                            <h2 className="title">Jenell D. Matney</h2>
                                            <p className="ticket-id">
                                                <i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div className="contact-info-row d-flex align-items-center justify-content-between">
                                        <a href="" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                                        <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                                    </div>
                                    <div className="main-content-area">
                                        <form>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Default checkbox
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="flexCheckChecked" defaultChecked />
                                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                                    Checked checkbox
                                                </label>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="comment" className="form-label">Comment</label>
                                                <textarea
                                                    rows="4"
                                                    className="form-control"
                                                    placeholder="Describe your conversation with client"
                                                    id="comment"
                                                    name="comment"
                                                ></textarea>
                                            </div>
                                            <div className="modal-footer justify-content-center border-0">
                                                <Button variant="secondary" onClick={handleCloses}>
                                                    Close
                                                </Button>
                                                <Button variant="primary" type="submit">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
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

export default Paid;
