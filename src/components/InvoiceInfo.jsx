import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const InvoiceInfo = () => {
    const [invoices, setInvoices] = useState([]);

    const [showDetails, setShowDetails] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        totalInvoices: null,
        totalPaidInvoices: null,
        totalPendingInvoices: null,
        totalAwaitingPaidInvoices: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Invoice Count Data
    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const response = await axiosInstance.get('/invoice/invoideCOunt');
                setInvoiceData({
                    totalInvoices: response.data.totalInvoices,
                    totalPaidInvoices: response.data.totalPaidInvoices,
                    totalPendingInvoices: response.data.totalPendingInvoices,
                    totalAwaitingPaidInvoices: response.data.totalAwaitingPaidInvoices,
                });
            } catch (err) {
                setError('Failed to fetch invoice data');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoiceData();
    }, []);

    // Fetch Invoice Details
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.get("/invoice/getinvoices");
                setInvoices(response.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
                setError("Failed to fetch invoices");
            }
        };
        fetchInvoices();
    }, []);

    if (loading) return <p className='text-center'>Loading...</p>;
    if (error) return <p>{error}</p>;

    const convertNumberToStringMonth = (number) => {
        switch (number) {
            case 1:
                return 'January';
            case 2:
                return 'February';
            case 3:
                return 'March';
            case 4:
                return 'April';
            case 5:
                return 'May';
            case 6:
                return 'June';
            case 7:
                return 'July';
            case 8:
                return 'August';
            case 9:
                return 'September';
            case 10:
                return 'October';
            case 11:
                return 'November';
            case 12:
                return 'December';
            default:
                return 'Invalid month';
        }
    };
    

    return (
        <>
            <section className="sadmin-top-section">
                <div className="container-fluid">
                    <div className="row">
                        {/* Total Invoices */}
                        <div className="col-md-3">
                            <div className="card position-relative">
                                <div className="div-top">
                                    <h3 className="title">Total Invoices</h3>
                                    <span className="sales">
                                        {invoiceData.totalInvoices !== null ? invoiceData.totalInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="d-flex justify-content-center flex-column align-items-center">
                                    <div className="icon-wrapper">
                                        <i className="fa-solid fa-wallet" style={{ cursor: "Pointer" }} onClick={() => setShowDetails(!showDetails)}></i>
                                    </div>
                                </div>
                                <div
                                    className={`details-box position-absolute bg-white border rounded p-3 shadow transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0 invisible'}`}
                                    style={{ top: '100%', left: '0', width: '100%' }}
                                >
                                    <p className="text-gray-800">Total Follow-ups: 50</p>
                                    <p className="text-gray-800">Total New: 30</p>
                                    <p className="text-gray-800">Total Sale: 20</p>
                                </div>
                            </div>
                        </div>

                        {/* Paid Invoices */}
                        <div className="col-md-3">
                            <div className="card">
                                <div className="div-top">
                                    <h3 className="title">Paid Invoices</h3>
                                    <span className="sales">
                                        {invoiceData.totalPaidInvoices !== null ? invoiceData.totalPaidInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                            </div>
                        </div>

                        {/* Pending Invoices */}
                        <div className="col-md-3 d-flex justify-content-between align-items-center">
                            <div className="card d-flex justify-content-between w-100">
                                <div className="div-top">
                                    <h3 className="title">Pending Invoices</h3>
                                    <span className="sales">
                                        {invoiceData.totalPendingInvoices !== null ? invoiceData.totalPendingInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                            </div>
                        </div>

                        {/* Awaiting Invoices */}
                        <div className="col-md-3">
                            <div className="card">
                                <div className="div-top">
                                    <h3 className="title">Awaiting Invoices</h3>
                                    <span className="sales">
                                        {invoiceData.totalAwaitingPaidInvoices !== null ? invoiceData.totalAwaitingPaidInvoices : 'N/A'}
                                        <span className="indicators"></span>
                                    </span>
                                </div>
                                <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="data-table-bgs_02x24 py-3">
                <div className="container-fluid">
                    <div className="table-wrapper">
                        <h3 className="title">Recent Transactions</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th tabindex="0">Created Date</th>
                                    <th tabindex="0">Ticket ID</th>
                                    <th tabindex="0">Currency</th>
                                    <th tabindex="0">Quoted Price</th>
                                    <th tabindex="0">Last Update</th>
                                    <th tabindex="0">Totel Amount</th>
                                    <th tabindex="0">Tracking Id</th>
                                    <th tabindex="0">Invoice Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length > 0 ? (
                                    invoices.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td>{invoice.createDate[2]}-{convertNumberToStringMonth(invoice.createDate[1])}-{invoice.createDate[0]}</td>
                                            <td>{invoice.ticketId}</td>
                                            <td>{invoice.currency}</td>
                                            <td>{invoice.quotedPrice}</td>
                                            <td>{invoice.lastupdateDate}</td>
                                            <td>{invoice.totalAmount}</td>
                                            <td>{(invoice.trackingNumber && invoice.inviceStatus==="paid")?invoice.trackingNumber:<button className='bg-primary'>Add Tracking Number</button>}</td>
                                            <td className={`${invoice.inviceStatus==='Pending'?"bg-danger":"bg-success"} d-flex justify-content-center text-white fw-bold`}>{invoice.inviceStatus}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No invoices found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </>

    );
};

export default InvoiceInfo;
